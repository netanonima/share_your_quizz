import { Component } from '@angular/core';
import {provideRouter} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  name = 'Angular 6';
    protected readonly provideRouter = provideRouter;
}
