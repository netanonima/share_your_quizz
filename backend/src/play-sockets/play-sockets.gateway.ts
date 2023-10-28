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
import axios from 'axios';

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
        console.log('admin-join');
        const { sessionId } = data;
        // add client id to session
        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, { admin: '', opened: false, users: [], current: -1, questions: [], ranking: [], questionsRanking: [] });
        }
        const session = this.sessions.get(sessionId);
        session.admin = client.id;
        session.opened= true;
        console.log('Session state:', this.sessions);

        if(session.admin && session.admin != ''){
            client.to(session.admin).emit('admin-join-response', 'Welcome admin!');
        }
        session.users.forEach(user => {
            client.to(user.id).emit('is-ready-response', `true`);
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
            this.sessions.set(sessionId, { admin: '', opened: false, users: [], current: -1, questions: [], ranking: [], questionsRanking: [] });
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
        // set opened to false, get the questions (including choices and medias) and send is-ready-response to players
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

        session.questions = shuffle(thisQuizz.questions);
        for(let i=0;i<session.questions.length;i++){
            if(session.questions[i].media){
                const mediaURL = session.questions[i].media.file_path + session.questions[i].media.filename + '.' + session.questions[i].media.extension;
                try{
                    const response = await axios.get(mediaURL, { responseType: 'arraybuffer' });
                    const mediaBase64 = Buffer.from(response.data).toString('base64');
                    session.questions[i].media = mediaBase64;
                } catch (error) {
                    console.log(error);
                }
            }
        }
        console.log(session.questions);
        for(let i=0;i<session.questions.length;i++){
            session.questionsRanking.push([]);
        }
        console.log(session.questionsRanking);
        session.users.forEach(user => {
            client.to(user.id).emit('game-is-ready', ``);
        });

    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('next-question')
    handleNextQuestion(@MessageBody() data: NextQuestionInterface, @ConnectedSocket() client: Socket): void {
        // current++ and send question (after++) to players
        const { sessionId } = data;
        const session = this.sessions.get(sessionId);
        session.current++;
        session.questions[session.current].askingDatetime = new Date();

        let currentQuestion = {
            question: session.questions[session.current].question,
            choices: [],
        }
        let currentAdminQuestion = currentQuestion;
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
        });

        session.users.forEach(user => {
            client.to(user.id).emit('question', currentQuestion);
        });

        if(session.admin && session.admin != ''){
            client.to(session.admin).emit('question', currentAdminQuestion);
        }
    }

    @SubscribeMessage('answer')
    handleAnswer(@MessageBody() data: AnswerInterface, @ConnectedSocket() client: Socket): void {
        // check if response was true, calculate score, store it then send question-answers to admin
        const currentDatetime = new Date();
        const { sessionId, choiceId } = data;
        const session = this.sessions.get(sessionId);
        const currentQuestion = session.questions[session.current];
        const choice = currentQuestion.choices.find(choice => choice.id === choiceId);
        const isCorrect = choice.is_correct;
        const username = session.users.find(user => user.id === client.id).username;
        if(isCorrect){
            const thisQuestionScore = Math.round(1000 - (currentDatetime.getTime() - currentQuestion.askingDatetime.getTime())/100);
            // adding to question ranking (session.questionsRanking[session.current])
            const questionsRankinguserIndex = session.questionsRanking[session.current].findIndex(user => user.userId === client.id);
            if(questionsRankinguserIndex !== -1){
                session.questionsRanking[session.current][questionsRankinguserIndex].currentScore += thisQuestionScore;
            }else{
                session.questionsRanking[session.current].push({username: username, currentScore: thisQuestionScore});
            }
            // adding to global ranking (session.ranking)
            const rankingUserIndex = session.ranking.findIndex(user => user.userId === client.id);
            if(rankingUserIndex !== -1){
                session.ranking[rankingUserIndex].currentScore += thisQuestionScore;
            }else{
                session.ranking.push({username: username, currentScore: thisQuestionScore});
            }
        }
    }

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
        const questionRanking = session.questionsRanking[session.current];
        const ranking = session.ranking;
        const results = {
            questionRanking: questionRanking,
            ranking: ranking
        };
        if(isLastQuestion){
            if(session.admin && session.admin != ''){
                client.to(session.admin).emit('quizz-results', results);
            }
            session.users.forEach(user => {
                client.to(user.id).emit('question-ended', ``);
            });
        }else{
            if(session.admin && session.admin != ''){
                client.to(session.admin).emit('question-answers', results);
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
