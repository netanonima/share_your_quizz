import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { QuizzComponent } from './quizz/quizz.component';
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { MatListModule } from "@angular/material/list";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FooterComponent } from './footer/footer.component';
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordRetrieveComponent } from './reset-password-retrieve/reset-password-retrieve.component';
import { QuizzesComponent } from './quizzes/quizzes.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MatSortModule } from "@angular/material/sort";
import { MatDialogModule } from "@angular/material/dialog";
import { DeleteConfirmationComponent } from './modal-dialogs/delete-confirmation/delete-confirmation.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    QuizzComponent,
    FooterComponent,
    ConfirmAccountComponent,
    ResetPasswordComponent,
    ResetPasswordRetrieveComponent,
    QuizzesComponent,
    PageNotFoundComponent,
    DeleteConfirmationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    FlexLayoutModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatListModule,
    MatSnackBarModule,
    MatSortModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
