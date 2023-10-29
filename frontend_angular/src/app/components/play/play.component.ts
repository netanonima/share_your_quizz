// play.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import {WebSocketService} from "../../services/websocket/websocket.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { animate, animateChild, query, stagger, state, style, transition, trigger } from "@angular/animations";
import {PlayerInterface} from "./interfaces/player.interface";
import {AuthService} from "../../services/auth/auth.service";
import {Question} from "../questions/question.interface";
import {QuestionInterface} from "./interfaces/question.interface";
import {ResultInterface} from "./interfaces/result.interface";

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(600)
      ])
    ])
  ]
})
export class PlayComponent implements OnInit, OnDestroy {
  public players: PlayerInterface[] = [];
  public playerClasses: { [username: string]: string } = {};
  public isReady: boolean = false;
  public readyToInvite: boolean = false;
  public joined: boolean = false;
  public gameLaunched: boolean = false;
  public currentQuestion: QuestionInterface = {question: '', choices: []};
  public currentAnswer: number = -1;
  public thisQuestionResult: ResultInterface = {players: []};
  public currentResult: ResultInterface = {players: []};
  public lastResult: ResultInterface = {players: []};
  public gameIsOver: boolean = false;
  public error: boolean = false;
  public url: string = window.location.href;
  public myName: string = '';
  public sessionId = this.route.snapshot.queryParamMap.get('id');
  public showGoodAnswers: boolean = false;
  public showQuestionResult: boolean = false;
  public showGlobalResult: boolean = false;

  setUsernameForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)])
  });


  constructor(
    private webSocketService: WebSocketService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.webSocketService.resetState();

    if(this.sessionId){
      this.webSocketService.connect(parseInt(this.sessionId));
    }

    this.webSocketService.players$.subscribe(players => {
      this.players = players;
    });

    this.webSocketService.playerClasses$.subscribe(playerClasses => {
      this.playerClasses = playerClasses;
    });

    this.webSocketService.isReady$.subscribe(isReady => {
      this.isReady = isReady;
    });

    this.webSocketService.readyToInvite$.subscribe(readyToInvite => {
      this.readyToInvite = readyToInvite;
    });

    this.webSocketService.joined$.subscribe(joined => {
      this.joined = joined;
    });

    this.webSocketService.gameLaunched$.subscribe(gameLaunched => {
      this.gameLaunched = gameLaunched;
    });

    this.webSocketService.currentQuestion$.subscribe(currentQuestion => {
      this.currentQuestion = currentQuestion;
    });

    this.webSocketService.currentAnswer$.subscribe(currentAnswer => {
      this.currentAnswer = currentAnswer;
    });

    this.webSocketService.thisQuestionResult$.subscribe(thisQuestionResult => {
      console.log('thisQuestionResult:', thisQuestionResult);
      this.thisQuestionResult = thisQuestionResult;
    });

    this.webSocketService.currentResult$.subscribe(currentResult => {
      console.log('currentResult:', currentResult);
      this.currentResult = currentResult;
    });

    this.webSocketService.lastResult$.subscribe(lastResult => {
      this.lastResult = lastResult;
    });

    this.webSocketService.gameIsOver$.subscribe(gameIsOver => {
      this.gameIsOver = gameIsOver;
    });
  }

  ngOnDestroy(): void {
    this.webSocketService.resetState();
    this.webSocketService.disconnect();
  }

  showGoodAnswersFunc(): void {
    this.showGoodAnswers = true;
    this.showQuestionResult = false;
    this.showGlobalResult = false;
  }

  showQuestionResultsFunc(): void {
    this.showGoodAnswers = false;
    this.showQuestionResult = true;
    this.showGlobalResult = false;
  }

  showGlobalResultsFunc(): void {
    this.showGoodAnswers = false;
    this.showGlobalResult = true;
    this.showQuestionResult = false;
  }

  nextQuestionFunc(): void {
    this.showGoodAnswers = false;
    this.showQuestionResult = false;
    this.showGlobalResult = false;
    this.nextQuestion();  // Appelle votre méthode existante nextQuestion
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.players, event.previousIndex, event.currentIndex);
  }

  /// actions

  // everybody actions
  navigateToQuizzes(): void {
    this.router.navigate([{ outlets: { playOutlet: null } }]).then(() => {
      this.router.navigate(['/quizzes']);
    });
  }

  // admin actions
  launchTheGame(): void {
    if(this.authService.isAuthenticated()) {
      this.webSocketService.gameLaunch();
    }else{
      console.log('You are not authenticated');
    }
  }

  nextQuestion(): void {
    if(this.authService.isAuthenticated()) {
      this.webSocketService.nextQuestion();
    }else{
      console.log('You are not authenticated');
    }
  }

  showResults(): void {
    if(this.authService.isAuthenticated()) {
      this.webSocketService.stopQuestion();
      this.showGoodAnswersFunc();
    }else{
      console.log('You are not authenticated');
    }
  }

  // user actions
  setUsername(): void {
    if (this.setUsernameForm.valid) {
      const { username } = this.setUsernameForm.value;
      if (this.sessionId) {
        this.webSocketService.join(username);
      }
    }
  }

  setUsernameCancel(): void {
    this.setUsernameForm.reset();
  }

  getErrorMessage(controlName: string): string {
    const control = this.setUsernameForm.get(controlName);
    if (control) {
      if (control.hasError('required')) {
        return 'You must enter a value';
      }

      if(control.hasError('minlength')) {
        return 'Minimum length is ' + control.getError('minlength').requiredLength;
      }

      if(control.hasError('maxlength')) {
        return 'Maximum length is ' + control.getError('maxlength').requiredLength;
      }
    }
    return '';
  }

  answerQuestion(choiceId: number): void {
    this.webSocketService.answer(choiceId);
  }
}
