import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {QuizzComponent} from "./quizz/quizz.component";
import {QuizzesComponent} from "./quizzes/quizzes.component";
import {ConfirmAccountComponent} from "./confirm-account/confirm-account.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {ResetPasswordRetrieveComponent} from "./reset-password-retrieve/reset-password-retrieve.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'quizz', component: QuizzComponent},
  {path: 'quizzes', component: QuizzesComponent},
  {path: 'confirm-account', component: ConfirmAccountComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'reset-password-retrieve', component: ResetPasswordRetrieveComponent},
  {path: '**', pathMatch: 'full', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
