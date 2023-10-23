import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { QuizzesComponent } from "./components/quizzes/quizzes.component";
import { QuestionsComponent } from "./components/questions/questions.component";
import { ConfirmAccountComponent } from "./components/confirm-account/confirm-account.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";
import { ResetPasswordRetrieveComponent } from "./components/reset-password-retrieve/reset-password-retrieve.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { PlayComponent} from "./components/play/play.component";
import {ChoicesComponent} from "./components/choices/choices.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'quizzes', component: QuizzesComponent},
  {path: 'questions', component: QuestionsComponent},
  {path: 'choices', component: ChoicesComponent},
  {path: 'confirm-account', component: ConfirmAccountComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'reset-password-retrieve', component: ResetPasswordRetrieveComponent},
  {path: 'play', component: PlayComponent, outlet: 'playOutlet'},
  {path: '**', pathMatch: 'full', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
