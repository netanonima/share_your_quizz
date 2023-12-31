// websocket.service.ts
import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from "../auth/auth.service";
import { BACKEND_URL } from "../../constants";
import { PlayerInterface } from "../../components/play/interfaces/player.interface";
import {QuestionInterface} from "../../components/play/interfaces/question.interface";
import {ResultInterface} from "../../components/play/interfaces/result.interface";
import {ResultsInterface} from "../../components/play/interfaces/results.interface";
import {AnswerDistributionInterface} from "../../components/play/interfaces/answer-distribution.interface";
import { LocalStorageDataInterface } from "../../components/play/interfaces/local-storage-data.interface";
import {CurrentQuestionRankingInterface} from "../../components/play/interfaces/current-question-ranking.interface";
import {CurrentGlobalRankingInterface} from "../../components/play/interfaces/current-global-ranking.interface";

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket?: Socket;
  private serverUrl = BACKEND_URL+'/play';
  private playersSubject = new BehaviorSubject<PlayerInterface[]>([]);
  private playerClassesSubject = new BehaviorSubject<{ [username: string]: string }>({});
  private isReadySubject = new BehaviorSubject<boolean>(false);
  private readyToInviteSubject = new BehaviorSubject<boolean>(false);
  private joinedSubject = new BehaviorSubject<boolean>(false);
  private gameLaunchedSubject = new BehaviorSubject<boolean>(false);
  private currentQuestionSubject = new BehaviorSubject<QuestionInterface>({question: '', choices: [], players: 0});
  private currentAnswerSubject = new BehaviorSubject<number>(-1);
  private currentResultSubject = new BehaviorSubject<ResultInterface>({players: []});
  private thisQuestionResultSubject = new BehaviorSubject<ResultInterface>({players: []});
  private lastResultSubject = new BehaviorSubject<ResultInterface>({players: []});
  private gameIsOverSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<boolean>(false);
  private currentQuestionAnswersSubject = new BehaviorSubject<number>(0);
  private currentQuestionResultIsCorrectSubject = new BehaviorSubject<boolean>(false);
  private currentQuestionResultPointsSubject = new BehaviorSubject<number>(0);
  private currentQuestionResultRankingSubject = new BehaviorSubject<number>(0);
  private currentQuestionTotalPlayersSubject = new BehaviorSubject<number>(0);
  private currentGlobalResultPointsSubject = new BehaviorSubject<number>(0);
  private currentGlobalResultRankingSubject = new BehaviorSubject<number>(0);
  private globalTotalPlayersSubject = new BehaviorSubject<number>(0);
  private answerDistributionSubject = new BehaviorSubject<[AnswerDistributionInterface]>([{id: 0, value: 0, isCorrect: false}]);
  private sessionId?: number;

  constructor(private authService: AuthService) {}

  connect(sessionId: number): void {
    this.sessionId = sessionId;
    if(this.authService.isAuthenticated()){
      this.socket = io(this.serverUrl, {
        extraHeaders:{
          Authorization: `Bearer ${this.authService.getToken()}`
        }
      });
    }else{
      this.socket = io(this.serverUrl);
    }

    // everybody
    this.socket.on('connect', ()=>this.handleConnect());
    this.socket.on('game-is-ready',(message: string)=>this.handleGameIsReady(message));
    this.socket.on('question',(message: QuestionInterface)=>this.handleQuestion(message));

    // admin
      this.socket.on('admin-join-response',(message: string)=>this.handleAdminJoinResponse(message));
      this.socket.on('answer-received',(message: string)=>this.handleAnswerReceived(message));
      this.socket.on('question-answers',(message: ResultsInterface)=>this.handleQuestionAnswers(message));
      this.socket.on('quizz-results',(message: ResultsInterface)=>this.handleQuizzResults(message));
      this.socket.on('new-player', (message: string) => this.handleNewPlayer(message));
      this.socket.on('player-left', (message: string) => this.handlePlayerLeft(message));
    // players
      this.socket.on('is-ready-response',(message: boolean)=>this.handleIsReadyResponse(message));
      this.socket.on('join-response',(message: string)=>this.handleJoinResponse(message));
      this.socket.on('rejoin-response',(message: string)=>this.handleRejoinResponse(message));
      this.socket.on('local-storage-data',(message: LocalStorageDataInterface)=>this.handleLocalStorageDataResponse(message));
      this.socket.on('question-ended',(message: string)=>this.handleQuestionEnded(message));
      this.socket.on('quizz-ended',(message: string)=>this.handleQuizzEnded(message));
      this.socket.on('current-question-ranking',(message: CurrentQuestionRankingInterface)=>this.handleCurrentQuestionRanking(message));
      this.socket.on('current-global-ranking',(message: CurrentGlobalRankingInterface)=>this.handleCurrentGlobalRanking(message));
      this.socket.on('error',(message: string)=>this.handleError(message));
  }

  /// receivers
  // everybody's receivers
  private handleConnect(): void{
    console.log('Websocket connection established');
    if(this.authService.isAuthenticated()){
      if(this.sessionId){
        this.socket?.emit('admin-join', {
          sessionId: this.sessionId
        });
      }else{
        console.log('No session id given through connect()');
      }
    }else{
      console.log('player is connected to the game');
      if(this.sessionId){
        this.socket?.emit('is-ready', {
          sessionId: this.sessionId
        });
      }else{
        console.log('No session id given through connect()');
      }
    }
  };

  private handleQuestion(message: QuestionInterface): void{
    // if not an admin
    if(!this.authService.isAuthenticated()){
      this.currentQuestionResultRankingSubject.next(0);
      this.currentGlobalResultRankingSubject.next(0);
    }
    this.currentQuestionAnswersSubject.next(0);
    this.currentAnswerSubject.next(-1);
    this.currentQuestionSubject.next(message);
    this.currentAnswerSubject.next(-1);
    if(this.authService.isAuthenticated()){
      this.answerDistributionSubject.next([{id:0, value: 0, isCorrect: false}]);
    }
  };

  // players receivers
  private handleIsReadyResponse(message: boolean): void{
    console.log('is-ready-response');
    this.isReadySubject.next(message);

    // reconnect
    const localStorageDataString = localStorage.getItem('parties');
    const localStorageData = localStorageDataString ? JSON.parse(localStorageDataString) : [];
    if(localStorageData.sessionId && localStorageData.user_id){
      const lastSessionId = localStorageData.sessionId;
      const lastUserId = localStorageData.user_id;
      this.reconnect(lastSessionId, lastUserId);
    }
  };

  private handleJoinResponse(message: string): void{
    let isOk = false;
    if(message === 'true'){
      isOk = true;
    }
    this.joinedSubject.next(isOk);
  };

  private handleRejoinResponse(message: string): void{
    let isOk = false;
    if(message === 'true'){
      isOk = true;
    }
    this.joinedSubject.next(isOk);
    this.gameLaunchedSubject.next(true);
  };

  private handleLocalStorageDataResponse(message: LocalStorageDataInterface): void{
    console.log('local-storage-data');
    localStorage.setItem('parties', JSON.stringify(message));
  };

  private handleGameIsReady(message: string): void{
    console.log('game-is-ready');
    this.gameLaunchedSubject.next(true);
  };

  private handleQuestionEnded(message: string): void{
    console.log('question-ended');
  };

  private handleQuizzEnded(message: string): void{
    console.log('quizz-ended');
    this.gameIsOverSubject.next(true);
  };

  private handleCurrentQuestionRanking(data: CurrentQuestionRankingInterface): void{
    console.log('current-question-ranking');
    console.log(data);
    this.currentQuestionResultIsCorrectSubject.next(data.isCorrect);
    this.currentQuestionResultPointsSubject.next(data.currentQuestionPoints);
    this.currentQuestionResultRankingSubject.next(data.currentQuestionRanking);
    this.currentQuestionTotalPlayersSubject.next(data.currentQuestionTotalPlayers);
  }

  private handleCurrentGlobalRanking(data: CurrentGlobalRankingInterface): void{
    console.log('current-global-ranking');
    console.log(data);
    this.currentGlobalResultPointsSubject.next(data.globalPoints);
    this.currentGlobalResultRankingSubject.next(data.globalRanking);
    this.globalTotalPlayersSubject.next(data.globalTotalPlayers);
  }

  private handleError(message: string): void{
    console.log('error');
    this.errorSubject.next(true);
  };

  // admin receivers
  private handleNewPlayer(message: string): void {
    console.log('new-player');
    const players = this.playersSubject.value;
    const newPlayer: PlayerInterface = {
      username: message,
      currentScore: 0
    } as PlayerInterface;
    players.push(newPlayer);
    this.playerClassesSubject.next({ ...this.playerClassesSubject.value, [message]: 'new-player' });
    setTimeout(() => {
      this.playerClassesSubject.next({ ...this.playerClassesSubject.value, [message]: '' });
    }, 500);
    this.playersSubject.next(players);
  }

  private handlePlayerLeft(message: string): void {
    const players = this.playersSubject.value;
    const playerIndex = players.findIndex(player => player.username === message);
    if (playerIndex !== -1) {
      this.playerClassesSubject.next({ ...this.playerClassesSubject.value, [message]: 'left-player' });
      setTimeout(() => {
        players.splice(playerIndex, 1);
        this.playerClassesSubject.next({ ...this.playerClassesSubject.value, [message]: '' });
        this.playersSubject.next(players);
      }, 500);
    }
  }

  private handleAdminJoinResponse(message: string): void{
    console.log('admin-join-response');
    this.readyToInviteSubject.next(true);
  };

  private handleAnswerReceived(message: string): void{
    console.log('answer-received');
    this.currentQuestionAnswersSubject.next(this.currentQuestionAnswersSubject.value+1);
  }

  private handleQuestionAnswers(message: ResultsInterface): void{
    console.log('question-answers');
    console.log(message);
    this.thisQuestionResultSubject.next(message.thisQuestionResult);
    this.currentResultSubject.next(message.result);
    this.answerDistributionSubject.next(message.answerDistribution);
  };

  private handleQuizzResults(message: ResultsInterface): void{
    console.log('quizz-results');
    this.thisQuestionResultSubject.next(message.thisQuestionResult);
    this.currentResultSubject.next(message.result);
    this.answerDistributionSubject.next(message.answerDistribution);
    this.gameIsOverSubject.next(true);
  };

  get players$(): Observable<PlayerInterface[]> {
    return this.playersSubject.asObservable();
  }

  get playerClasses$(): Observable<{ [username: string]: string }> {
    return this.playerClassesSubject.asObservable();
  }

  get isReady$(): Observable<boolean> {
    return this.isReadySubject.asObservable();
  }

  get readyToInvite$(): Observable<boolean> {
    return this.readyToInviteSubject.asObservable();
  }

  get joined$(): Observable<boolean> {
    return this.joinedSubject.asObservable();
  }

  get gameLaunched$(): Observable<boolean> {
    return this.gameLaunchedSubject.asObservable();
  }

  get currentQuestion$(): Observable<QuestionInterface> {
    return this.currentQuestionSubject.asObservable();
  }

  get currentAnswer$(): Observable<number> {
    return this.currentAnswerSubject.asObservable();
  }

  get thisQuestionResult$(): Observable<ResultInterface> {
    return this.thisQuestionResultSubject.asObservable();
  }

  get currentResult$(): Observable<ResultInterface> {
    return this.currentResultSubject.asObservable();
  }

  get lastResult$(): Observable<ResultInterface> {
    return this.lastResultSubject.asObservable();
  }

  get gameIsOver$(): Observable<boolean> {
    return this.gameIsOverSubject.asObservable();
  }

  get error$(): Observable<boolean> {
    return this.errorSubject.asObservable();
  }

  get currentQuestionAnswers$(): Observable<number> {
    return this.currentQuestionAnswersSubject.asObservable();
  }

  get currentQuestionResultIsCorrect$(): Observable<boolean> {
    return this.currentQuestionResultIsCorrectSubject.asObservable();
  }

  get currentQuestionResultPoints$(): Observable<number> {
    return this.currentQuestionResultPointsSubject.asObservable();
  }

  get currentQuestionResultRanking$(): Observable<number> {
    return this.currentQuestionResultRankingSubject.asObservable();
  }

  get currentQuestionTotalPlayers$(): Observable<number> {
    return this.currentQuestionTotalPlayersSubject.asObservable();
  }

  get currentGlobalResultPoints$(): Observable<number> {
    return this.currentGlobalResultPointsSubject.asObservable();
  }

  get currentGlobalResultRanking$(): Observable<number> {
    return this.currentGlobalResultRankingSubject.asObservable();
  }

  get globalTotalPlayers$(): Observable<number> {
    return this.globalTotalPlayersSubject.asObservable();
  }

  get answerDistribution$(): Observable<[AnswerDistributionInterface]> {
    return this.answerDistributionSubject.asObservable();
  }

  /// emitters
  // everybody's emitters
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      console.log('Disconnected from socket');
    }
  }

  // players emitters
  isready(): void {
    this.socket?.emit('is-ready', {
      sessionId: this.sessionId
    });
  }

  join(username: string): void {
    this.socket?.emit('join', {
      sessionId: this.sessionId,
      username: username
    });
  }

  reconnect(sessionId: number, userId: string): void {
    console.log('reconnect');
    this.socket?.emit('player-reconnect-try', {
      sessionId: sessionId,
      user_id: userId
    });
  }

  answer(choiceId: number): void {
    this.socket?.emit('answer', {
      sessionId: this.sessionId,
      choiceId: choiceId
    });
    this.currentAnswerSubject.next(choiceId);
  }

  // admin emitters
  adminjoin(): void {
    if(this.authService.isAuthenticated()) {
      this.socket?.emit('admin-join', {
        sessionId: this.sessionId
      });
      this.isReadySubject.next(true);
    }else{
      console.log('not authenticated');
    }
  }

  gameLaunch(): void {
    if(this.authService.isAuthenticated()) {
      console.log('game-launch emitted');
      this.socket?.emit('game-launch', {
        sessionId: this.sessionId
      });
    }else{
      console.log('not authenticated');
    }
  }

  nextQuestion(): void {
    if(this.authService.isAuthenticated()) {
      this.socket?.emit('next-question', {
        sessionId: this.sessionId
      });
      this.lastResultSubject.next({players: []});
      this.currentResultSubject.next({players: []});
      this.thisQuestionResultSubject.next({players: []});
    }else{
      console.log('not authenticated');
    }
  }

  stopQuestion(): void {
    if(this.authService.isAuthenticated()) {
      this.socket?.emit('stop-question', {
        sessionId: this.sessionId
      });
    }else{
      console.log('not authenticated');
    }
  }

  watchGlobalResults(): void {
    if(this.authService.isAuthenticated()) {
      this.socket?.emit('current-global-ranking-trigger', {
        sessionId: this.sessionId
      });
    }else{
      console.log('not authenticated');
    }
  }

  resetState(): void {
    this.playersSubject.next([]);
    this.playerClassesSubject.next({});
    this.isReadySubject.next(false);
    this.readyToInviteSubject.next(false);
    this.joinedSubject.next(false);
    this.gameLaunchedSubject.next(false);
    this.currentQuestionSubject.next({question: '', choices: [], players: 0});
    this.currentAnswerSubject.next(-1);
    this.currentResultSubject.next({players: []});
    this.thisQuestionResultSubject.next({players: []});
    this.lastResultSubject.next({players: []});
    this.gameIsOverSubject.next(false);
    this.errorSubject.next(false);
  }
}
