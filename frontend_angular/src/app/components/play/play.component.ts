import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from "../../services/api/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import { io, Socket } from 'socket.io-client';
import {BACKEND_URL} from "../../constants";
import {PlayerInterface} from "./interfaces/player.interface";
import {animate, animateChild, query, stagger, state, style, transition, trigger} from "@angular/animations";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
export class PlayComponent implements OnInit, OnDestroy{
  private socket?: Socket;
  private serverUrl = BACKEND_URL+'/play';
  error: boolean = false;
  public url: string = window.location.href; // host, hostname, href, origin, port, protocol
  public players: PlayerInterface[] = [];
  public myName: string = '';
  public playerClasses: { [username: string]: string } = {};

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.players, event.previousIndex, event.currentIndex);
  }

  setUsernameForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)])
  });

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

  setUsername(){
    if (this.setUsernameForm.valid) {
      console.log(this.setUsernameForm.value);
      this.onSubmit();
    }
  }

  setUsernameCancel(){
    this.setUsernameForm.reset();
  }

  onSubmit() {
    if (this.setUsernameForm.valid) {
      console.log('onSubmit');
      this.myName = this.setUsernameForm.value.username;
      this.socket?.emit('join', {
        sessionId: this.route.snapshot.queryParamMap.get('id'),
        username: this.myName
      });
    }
  }

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('id');
    if(this.authService.isAuthenticated()){
      if(sessionId && sessionId!=null){
        this.apiService.getSession(sessionId).subscribe(
          (result) => {
            console.log('Session retrieved');
            console.log(result);
            this.error = false;
            // start session for host
            console.log('Start session for host');
            this.connectToSocket();
            this.socket?.emit('admin-join', {
              sessionId: sessionId
            });
          },
          (error) => {
            console.log(error);
            this.error = true;
          }
        );
      }else{
        console.log('No session id provided');
        this.error = true;
      }
    }else{
      // start session for players
      console.log('Start session for players');
      this.connectToSocket();
    }

  }

  ngOnDestroy() {
    console.log('PlayComponent destroyed');
    const sessionId = this.route.snapshot.queryParamMap.get('id');
    if(sessionId && sessionId!=null){
      this.apiService.deleteSession(sessionId).subscribe(
        (result) => {
          console.log('Session deleted');
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  navigateToQuizzes() {
    this.router.navigate([{ outlets: { playOutlet: null } }]).then(() => {
      // Étape 2: Naviguez vers la nouvelle route
      this.router.navigate(['/quizzes']);
    });
  }

  private connectToSocket(): void {
    //if user connected
    if(this.authService.isAuthenticated()){
      this.socket = io(this.serverUrl, {
        extraHeaders:{
          Authorization: `Bearer ${this.authService.getToken()}`
        }
      });
    }else{
      this.socket = io(this.serverUrl);
    }


    this.socket.on('connect', () => {
      console.log('Websocket connection established');
    });

    this.socket.on('admin-left', (message: string) => {
      console.log('admin-left:', message);
    });

    // Ajoutez d'autres gestionnaires d'événements ici selon vos besoins
    if(this.authService.isAuthenticated()) {
      // admin listeners
      this.socket.on('error', (message: string) => {
        console.log('an error occurred : ', message);
      });

      this.socket.on('admin-join-response', (message: string) => {
        console.log('admin joined the session');
      });

      this.socket.on('new-player', (message: string) => {
        console.log('new player joined the session');
        const newPlayer: PlayerInterface = {
          username: message,
          currentScore: 0
        } as PlayerInterface;
        this.players.push(newPlayer);
        this.playerClasses[message] = 'new-player';

        setTimeout(() => {
          this.playerClasses[message] = '';
        }, 500);
      });

      this.socket.on('player-left', (message: string) => {
        console.log('a player left the session');
        const playerIndex = this.players.findIndex(player => player.username === message);
        if (playerIndex !== -1) {
          this.playerClasses[message] = 'left-player';
          setTimeout(() => {
            this.players.splice(playerIndex, 1);
          }, 500);
        }
      });

    }else{
      // player listeners

    }
  }

  private disconnectFromSocket(): void {
    if (this.socket) {
      this.socket.disconnect();
      console.log('Disconnected from socket');
    }
  }
}
