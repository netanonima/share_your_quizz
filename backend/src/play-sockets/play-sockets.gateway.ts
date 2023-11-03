// sockets.gateway.ts
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {JoinInterface} from "play-sockets/interfaces/join.interface";
import {UserInterface} from "play-sockets/interfaces/user.interface";
import {SessionInterface} from "play-sockets/interfaces/session.interface";
import {IsReadyInterface} from "play-sockets/interfaces/is-ready.interface";
import {GameLaunchInterface} from "play-sockets/interfaces/game-launch.interface";
import {NextQuestionInterface} from "play-sockets/interfaces/next-question.interface";
import {StopQuestionInterface} from "play-sockets/interfaces/stop-question.interface";
import {AnswerInterface} from "play-sockets/interfaces/answer.interface";
import {UseFilters, UseGuards} from "@nestjs/common";
import {WsJwtGuard} from "play-sockets/guards/ws-jwt.guard";
import {WsExceptionFilter} from "play-sockets/filters/ws-exception.filter";
import {AdminJoinInterface} from "play-sockets/interfaces/admin-join.interface";
import { ConfigService } from '@nestjs/config'
import { SessionsService } from '../sessions/sessions.service';
import {QuizzsService} from "quizzs/quizzs.service";
import * as fs from 'fs';

@UseFilters(new WsExceptionFilter())
@WebSocketGateway({
    namespace: 'play',
    cors: {
        origin: (origin, callback) => {
            const configService = new ConfigService();
            const allowedOrigin = configService.get('FRONTEND_URL');
            if (!allowedOrigin || origin === allowedOrigin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    },
})
export class PlaySocketsGateway {
    constructor(
        private sessionsService: SessionsService,
        private quizzsService: QuizzsService,
        private config: ConfigService,
    ) {}
    private sessions = new Map<number, SessionInterface>();

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('admin-join')
    handleAdminJoin(@MessageBody() data: AdminJoinInterface, @ConnectedSocket() client: Socket): void {
        console.log('admin-join received');
        const { sessionId } = data;
        this.sessions.forEach((session, sessionId) => {
            if (session.admin === '') {
                this.sessions.delete(sessionId);
            }
        });
        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, { admin: '', opened: false, users: [], current: -1, questions: [], ranking: {players: []}, questionsRanking: [], answersDistribution: [], params: {shuffle_questions: false, shuffle_choices: false} });
        }
        const session = this.sessions.get(sessionId);
        session.admin = client.id;
        session.opened= true;
        console.log('Session state:', this.sessions);

        if(session.admin && session.admin != ''){
            client.emit('admin-join-response', true);
        }
        session.users.forEach(user => {
            client.to(user.id).emit('is-ready-response', true);
        });
    }

    @SubscribeMessage('is-ready')
    handleIsReady(@MessageBody() data: IsReadyInterface, @ConnectedSocket() client: Socket): void {
        // check if admin is here and if opened is true then send is-ready-response to players
        const { sessionId } = data;
        if(this.sessions.has(sessionId)) {
            const session = this.sessions.get(sessionId);
            if (session.admin && session.admin != '') {
                if(session.opened){
                    client.emit('is-ready-response', true);
                }else{
                    client.emit('is-ready-response', false);
                }
            } else {
                client.emit('is-ready-response', false);
            }
        } else {
            client.emit('is-ready-response', false);
        }
    }

    @SubscribeMessage('join')
    handleJoin(@MessageBody() data: JoinInterface, @ConnectedSocket() client: Socket): void {
        const { sessionId, username } = data;

        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, { admin: '', opened: false, users: [], current: -1, questions: [], ranking: {players: []}, questionsRanking: [], answersDistribution: [], params: {shuffle_questions: false, shuffle_choices: false} });
        }

        const session = this.sessions.get(sessionId);

        console.log(this.sessions);
        console.log(session);
        console.log('session.opened');
        console.log(session.opened);
        console.log(typeof session.opened);
        if(session.admin=='' || !session.opened){
            client.emit('join-response', `You can't join this game session.`);
            return;
        }

        if (session.users.some(user => user.username === username)) {
            client.emit('join-response', `Username already exists`);
            return;
        }
        if (session.users.some(user => user.id === client.id)) {
            client.emit('join-response', `Client already exists`);
            return;
        }

        const user: UserInterface = { id: client.id, username };
        session.users.push(user);

        console.log(`User ${username} joined session ${sessionId}`);
        console.log('Session state:', this.sessions);
        console.log('Session users:', session.users);
        client.emit('join-response', `true`);

        // send message to admin
        const admin = this.sessions.get(sessionId).admin;
        if (admin) {
            console.log(`Sending new-player event to admin ${admin}`);
            client.to(admin).emit('new-player', user.username);
        }
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('game-launch')
    async handleGameLaunch(@MessageBody() data: GameLaunchInterface, @ConnectedSocket() client: Socket): Promise<void> {
        console.log('game-launch received');

        const { sessionId } = data;
        const session = this.sessions.get(sessionId);
        session.opened = false;

        const thisSession = await this.sessionsService.findOne(sessionId);
        const thisQuizz = await this.quizzsService.findOne(thisSession.quizz.id);

        function shuffle(array) {
            let currentIndex = array.length, temporaryValue, randomIndex;
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        }

        session.params = {
            shuffle_questions: thisQuizz.param_shuffle_questions,
            shuffle_choices: thisQuizz.param_shuffle_choices,
        }

        if(session.params.shuffle_questions){
            session.questions = shuffle(thisQuizz.questions);
        }else{
            session.questions = thisQuizz.questions.sort((a, b) => (a.id > b.id) ? 1 : -1);
        }

        let j = 0;
        for(let i=0;i<session.questions.length;i++){
            if(session.questions[i].media){
                let mediaPath = session.questions[i].media.file_path + session.questions[i].media.filename + '.' + session.questions[i].media.extension;
                // manage backslashes
                mediaPath = mediaPath.replace(/\\/g, '/');
                console.log('mediaPath');
                console.log(mediaPath);
                fs.readFile(mediaPath, (error, mediaData) => {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    const mediaBase64 = Buffer.from(mediaData).toString('base64');
                    let realExtension = session.questions[i].media.extension;
                    if(session.questions[i].media.extension.toLowerCase() ==='mp3')realExtension = 'mpeg';
                    if(session.questions[i].media.extension.toLowerCase() ==='jpg')realExtension = 'jpeg';

                    session.questions[i].media = "data:'"+session.questions[i].media.type+"/"+realExtension+"';base64,"+mediaBase64;
                    console.log(session.questions[i].media.slice(0, 100) + '...');
                    j++;
                    if(j===session.questions.length){
                        endingAction();
                    }
                });
            }else{
                j++;
                if(j===session.questions.length){
                    endingAction();
                }
            }
        }
        function endingAction(){
            for(let i=0;i<session.questions.length;i++){
                session.questionsRanking.push([]);
                let choices = session.questions[i].choices;
                let choicesList = [];
                choices.forEach(choice => {
                    let thisChoice = {
                        id: choice.id,
                        value: 0,
                        isCorrect: choice.is_correct,
                    }
                    choicesList.push(thisChoice);
                });
                session.answersDistribution.push(choicesList);
            }
            session.ranking = { players: session.users.map(user => ({ username: user.username, currentScore: 0 })) };
            session.users.forEach(user => {
                client.to(user.id).emit('game-is-ready', ``);
            });
            client.emit('game-is-ready', ``);
        }

    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('next-question')
    handleNextQuestion(@MessageBody() data: NextQuestionInterface, @ConnectedSocket() client: Socket): void {
        // current++ and send question (after++) to players
        const { sessionId } = data;
        const session = this.sessions.get(sessionId);
        session.current++;
        if (!session) {
            console.error('Session not found:', sessionId);
            return;
        }
        if (!Array.isArray(session.questions)) {
            console.error('session.questions is not an array:', session.questions);
            return;
        }
        if (session.current >= session.questions.length) {
            console.error('Invalid index:', session.current);
            return;
        }
        if (!session.questions[session.current]) {
            console.error('Question not found:', session.current);
            return;
        }

        session.questions[session.current].askingDatetime = new Date();

        let currentQuestion = {
            question: session.questions[session.current].question,
            choices: [],
        }
        let currentAdminQuestion = {
            question: session.questions[session.current].question,
            choices: [],
            media: '',
        };
        session.questions[session.current].choices.forEach(choice => {
            currentQuestion.choices.push({
                choiceId: choice.id,
                choice: choice.choice,
            });
            currentAdminQuestion.choices.push({
                choiceId: choice.id,
                choice: choice.choice,
                isCorrect: choice.is_correct,
            });
            if( session.questions[session.current].media){
                currentAdminQuestion.media =  session.questions[session.current].media;
            }
        });

        function shuffle(array) {
            let currentIndex = array.length, temporaryValue, randomIndex;
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        }

        if(session.params.shuffle_choices){
            currentQuestion.choices = shuffle(currentQuestion.choices);
            let currentAdminQuestionChoices = [];
            currentQuestion.choices.forEach(choice => {
                let currentChoice = currentAdminQuestion.choices.find(currentChoice => currentChoice.choiceId === choice.choiceId);
                currentAdminQuestionChoices.push(currentChoice);
            });
            currentAdminQuestion.choices = currentAdminQuestionChoices;
            // set session.answersDistribution[session.current] in the same order as currentQuestion.choices
            let currentQuestionAnswersDistribution = [];
            currentQuestion.choices.forEach(choice => {
                let currentChoice = session.answersDistribution[session.current].find(currentChoice => currentChoice.id === choice.choiceId);
                currentQuestionAnswersDistribution.push(currentChoice);
            });
            session.answersDistribution[session.current] = currentQuestionAnswersDistribution;
        }else{
            currentQuestion.choices = currentQuestion.choices.sort((a, b) => (a.choiceId > b.choiceId) ? 1 : -1);
            currentAdminQuestion.choices = currentAdminQuestion.choices.sort((a, b) => (a.choiceId > b.choiceId) ? 1 : -1);
        }

        session.users.forEach(user => {
            client.to(user.id).emit('question', currentQuestion);
        });

        if(session.admin && session.admin != ''){
            client.emit('question', currentAdminQuestion);
        }
    }

    @SubscribeMessage('answer')
    handleAnswer(@MessageBody() data: AnswerInterface, @ConnectedSocket() client: Socket): void {
        // check if response was true, calculate score, store it then send question-answers to admin
        console.log('answer received');
        const currentDatetime = new Date();
        const { sessionId, choiceId } = data;
        const session = this.sessions.get(sessionId);
        if (!session) {
            console.error('Session not found:', sessionId);
            return;
        }
        if (session.current < 0 || session.current >= session.questions.length) {
            console.error('Invalid current question index:', session.current);
            return;
        }
        const currentQuestionAnswersDistribution = session.answersDistribution[session.current];
        const choiceIndex = currentQuestionAnswersDistribution.findIndex(choice => choice.id === choiceId);
        session.answersDistribution[session.current][choiceIndex].value++;

        if(session.admin && session.admin != ''){
            console.log('answer-received sent');
            console.log(client.id);
            client.to(session.admin).emit('answer-received', '');
        }
        const currentQuestion = session.questions[session.current];
        const choice = currentQuestion.choices.find(choice => choice.id === choiceId);
        const isCorrect = choice.is_correct;
        const user = session.users.find(user => user.id === client.id);
        if (!user) {
            console.error('User not found:', client.id);
            return;
        }
        const username = user.username;
        if(isCorrect){
            const thisQuestionScore = Math.round(1000 - (currentDatetime.getTime() - currentQuestion.askingDatetime.getTime())/100);
            if (session.current === undefined || session.current < 0 || session.current >= session.questionsRanking.length) {
                console.error('Invalid session.current:', session.current);
                return;
            }
            if (Array.isArray(session.questionsRanking[session.current]) || !session.questionsRanking[session.current]) {
                session.questionsRanking[session.current] = {players: []};
            }
            let questionRanking = session.questionsRanking[session.current];
            const playerIndex = questionRanking.players.findIndex(player => player.username === username);
            if(playerIndex !== -1){
                questionRanking.players[playerIndex].currentScore += thisQuestionScore;
            }else{
                questionRanking.players.push({username: username, currentScore: thisQuestionScore});
            }

            session.questionsRanking[session.current] = questionRanking;

            const rankingPlayerIndex = session.ranking.players.findIndex(player => player.username === username);
            if(rankingPlayerIndex !== -1){
                session.ranking.players[rankingPlayerIndex].currentScore += thisQuestionScore;
            } else {
                session.ranking.players.push({username: username, currentScore: thisQuestionScore});
            }
        }else{
            const thisQuestionScore = 0;
            if (session.current === undefined || session.current < 0 || session.current >= session.questionsRanking.length) {
                console.error('Invalid session.current:', session.current);
                return;
            }
            if (Array.isArray(session.questionsRanking[session.current]) || !session.questionsRanking[session.current]) {
                session.questionsRanking[session.current] = {players: []};
            }
            let questionRanking = session.questionsRanking[session.current];
            const playerIndex = questionRanking.players.findIndex(player => player.username === username);
            if(playerIndex !== -1){
                questionRanking.players[playerIndex].currentScore += thisQuestionScore;
            }else{
                questionRanking.players.push({username: username, currentScore: thisQuestionScore});
            }

            session.questionsRanking[session.current] = questionRanking;

            const rankingPlayerIndex = session.ranking.players.findIndex(player => player.username === username);
            if(rankingPlayerIndex !== -1){
                if(session.ranking.players[rankingPlayerIndex].currentScore){
                    session.ranking.players[rankingPlayerIndex].currentScore += thisQuestionScore;
                }else{
                    session.ranking.players[rankingPlayerIndex].currentScore = thisQuestionScore;
                }
            }else{
                session.ranking.players.push({username: username, currentScore: thisQuestionScore});
            }
        }
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('stop-question')
    handleStopQuestion(@MessageBody() data: StopQuestionInterface, @ConnectedSocket() client: Socket): void {
        const { sessionId } = data;
        const session = this.sessions.get(sessionId);
        const isLastQuestion = session.current === session.questions.length-1;
        if(!isLastQuestion){
            session.users.forEach(user => {
                client.to(user.id).emit('question-ended', ``);
            });
        }
        // add 0 points to players who didn't answer in session.questionsRanking and in session.ranking
        session.users.forEach(user => {
            const username = user.username;
            const rankingPlayerIndex = session.ranking.players.findIndex(player => player.username === username);
            if(rankingPlayerIndex !== -1){
                // do nothing
            }else{
                session.ranking.players.push({username: username, currentScore: 0});
            }
            if (session.current === undefined || session.current < 0 || session.current >= session.questionsRanking.length) {
                console.error('Invalid session.current:', session.current);
                return;
            }
            if (Array.isArray(session.questionsRanking[session.current]) || !session.questionsRanking[session.current]) {
                session.questionsRanking[session.current] = {players: []};
            }
            let questionRanking = session.questionsRanking[session.current];
            const playerIndex = questionRanking.players.findIndex(player => player.username === username);
            if(playerIndex !== -1){
                // do nothing
            }else{
                questionRanking.players.push({username: username, currentScore: 0});
            }
        });


        const questionRanking = session.questionsRanking[session.current];
        const ranking = session.ranking;
        if(questionRanking.length > 1){
            questionRanking.players = questionRanking.players.sort((a, b) => (a.currentScore < b.currentScore) ? 1 : -1);
        }
        if(ranking.players.length > 1){
            ranking.players.sort((a, b) => (a.currentScore < b.currentScore) ? 1 : -1);
        }
        console.log('session.answersDistribution[session.current]');
        console.log(session.answersDistribution[session.current]);
        const results = {
            thisQuestionResult: questionRanking,
            result: ranking,
            answerDistribution: session.answersDistribution[session.current],
        };
        if(isLastQuestion){
            const winner = ranking.players[0];
            const winnerUsername = winner.username;
            const winnerPoints = winner.currentScore;
            this.sessionsService.update(sessionId, {winner_username: winnerUsername, winner_points: winnerPoints});

            if(session.admin && session.admin != ''){
                client.emit('quizz-results', results);
            }
            session.users.forEach(user => {
                client.to(user.id).emit('quizz-ended', ``);
            });
        }else{
            if(session.admin && session.admin != ''){
                client.emit('question-answers', results);
            }
        }
    }

    @SubscribeMessage('disconnect')
    handleDisconnect(@ConnectedSocket() client: Socket): void {
        console.log(`Client disconnected: ${client.id}`);

        this.sessions.forEach((session, sessionId) => {
            const userIndex = session.users.findIndex(user => user.id === client.id);
            if (userIndex !== -1) {
                const username = session.users[userIndex].username;
                console.log(`User ${username} left session ${sessionId}`);
                session.users.splice(userIndex, 1);
                if(session.admin && session.admin != ''){
                    client.to(session.admin).emit('player-left', username);
                }
            }

            if (session.admin === client.id) {
                console.log(`Admin of session ${sessionId} disconnected`);
                session.admin = '';
                session.users.forEach(user => {
                    client.to(user.id).emit('error', `Admin just left the session`);
                });
            }
        });

        console.log('Session state after disconnect:', this.sessions);
    }
}
