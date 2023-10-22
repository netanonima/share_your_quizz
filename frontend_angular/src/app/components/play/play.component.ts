import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from "../../services/api/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import { io, Socket } from 'socket.io-client';
import {ConfigService} from "@nestjs/config";

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, OnDestroy{
  config = new ConfigService();
  private socket?: Socket;
  private serverUrl = this.config.get('BACKEND_URL')+'/play';
  error: boolean = false;
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
    this.socket = io(this.serverUrl);

    this.socket.on('connect', () => {
      console.log('Websocket connection established');
    });

    this.socket.on('admin-left', (message: string) => {
      console.log('admin-left:', message);
    });

    // Ajoutez d'autres gestionnaires d'événements ici selon vos besoins
  }

  private disconnectFromSocket(): void {
    if (this.socket) {
      this.socket.disconnect();
      console.log('Disconnected from socket');
    }
  }
}
