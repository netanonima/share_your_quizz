import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MatInputModule } from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MatListModule } from "@angular/material/list";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FooterComponent } from './components/footer/footer.component';
import { ConfirmAccountComponent } from './components/confirm-account/confirm-account.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ResetPasswordRetrieveComponent } from './components/reset-password-retrieve/reset-password-retrieve.component';
import { QuizzesComponent } from './components/quizzes/quizzes.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MatSortModule } from "@angular/material/sort";
import { MatDialogModule } from "@angular/material/dialog";
import { DeleteConfirmationComponent } from './modal-dialogs/delete-confirmation/delete-confirmation.component';
import { NewElementComponent } from './modal-dialogs/new-element/new-element.component';
import { PlayComponent } from './components/play/play.component';
import { QRCodeModule } from 'angularx-qrcode';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { QuestionsComponent } from './components/questions/questions.component';
import { RenameElementComponent } from './modal-dialogs/rename-element/rename-element.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    ConfirmAccountComponent,
    ResetPasswordComponent,
    ResetPasswordRetrieveComponent,
    QuizzesComponent,
    PageNotFoundComponent,
    DeleteConfirmationComponent,
    NewElementComponent,
    PlayComponent,
    QuestionsComponent,
    RenameElementComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DragDropModule,
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
    MatDialogModule,
    FormsModule,
    QRCodeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
