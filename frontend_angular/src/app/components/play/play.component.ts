import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebSocketService} from "../../services/websocket/websocket.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { animate, state, style, transition, trigger } from "@angular/animations";
import {PlayerInterface} from "./interfaces/player.interface";
import {AuthService} from "../../services/auth/auth.service";
import {QuestionInterface} from "./interfaces/question.interface";
import {ResultInterface} from "./interfaces/result.interface";
import {AnswerDistributionInterface} from "./interfaces/answer-distribution.interface";
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').indexOf(' ') >= 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  };
}

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
  public answerDistribution: [AnswerDistributionInterface] = [{id: 0, value: 0, isCorrect: false}];
  public mediaType: string = '';
  public currentQuestionAnswers: number = 0;

  setUsernameForm: FormGroup = new FormGroup({
    playerUsername: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20),
      noWhitespaceValidator()
    ])
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
      if(currentQuestion.media && currentQuestion.media.startsWith('data:')){
        const base64FirstPart = currentQuestion.media.split(';')[0];
        const mimeType = base64FirstPart.split('\'')[1];
        let type = mimeType.split('/')[0];
        if(mimeType === 'video/mpeg') type = 'audio';
        this.mediaType = type;
      }
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

    this.webSocketService.currentQuestionAnswers$.subscribe(currentQuestionAnswers => {
      this.currentQuestionAnswers = currentQuestionAnswers;
    });

    this.webSocketService.error$.subscribe(error => {
      this.error = error;
    });

    this.webSocketService.answerDistribution$.subscribe(answerDistribution => {
      this.answerDistribution = answerDistribution;
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
    console.log('launchTheGame');
    if(this.authService.isAuthenticated()) {
      this.webSocketService.gameLaunch();
    }else{
      console.log('You are not authenticated');
    }
  }

  nextQuestion(): void {
    if(this.authService.isAuthenticated()) {
      this.currentQuestion = {question: '', choices: []};
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
      const { playerUsername } = this.setUsernameForm.value;
      if (this.sessionId) {
        this.webSocketService.join(playerUsername);
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
        return $localize`:@@requiredError:You must enter a value`;
      }

      if(control.hasError('minlength')) {
        return $localize`:@@minLengthError:Minimum length is ` + control.getError('minlength').requiredLength;
      }

      if(control.hasError('maxlength')) {
        return $localize`:@@maxLengthError:Maximum length is ` + control.getError('maxlength').requiredLength;
      }

      if (control.hasError('whitespace')) {
        return $localize`:@@whitespaceError:No spaces are allowed`;
      }
    }
    return '';
  }

  answerQuestion(choiceId: number): void {
    this.webSocketService.answer(choiceId);
  }
}
