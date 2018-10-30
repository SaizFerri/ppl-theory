import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { QuestionnaireComponent } from './components/questionnaire/questionnaire.component';
import { WrongQuestionnaireMenuComponent } from './components/wrong-questionnaire-menu/wrong-questionnaire-menu.component';
import { WrongQuestionnaireComponent } from './components/wrong-questionnaire/wrong-questionnaire.component';
import { WrongWrapperComponent } from './components/wrong-wrapper/wrong-wrapper.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  { path: 'login', component: UserLoginComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: ':subject/:id', component: QuestionnaireComponent, canActivate: [AuthGuard] },
  { 
    path: 'wrong', 
    component: WrongWrapperComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        children: [
          { path: '', component: WrongQuestionnaireMenuComponent },
          { path: ':subject/:id', component: WrongQuestionnaireComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
