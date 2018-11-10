import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionnaireComponent } from '@app/core/components/questionnaire/questionnaire.component';
import { AuthGuard } from '@app/core';
import { WrongWrapperComponent } from '@app/core/components/wrong-wrapper/wrong-wrapper.component';
import { WrongQuestionnaireMenuComponent } from '@app/core/components/wrong-questionnaire-menu/wrong-questionnaire-menu.component';
import { WrongQuestionnaireComponent } from '@app/core/components/wrong-questionnaire/wrong-questionnaire.component';
import { UserLoginComponent } from '@app/core/components/user-login/user-login.component';
import { StartComponent } from '@app/core/components/start/start.component';

const routes: Routes = [
  { path: 'login', component: UserLoginComponent },
  { path: '', component: StartComponent, canActivate: [AuthGuard] },
  { path: 'questionnaire/:subject/:id', component: QuestionnaireComponent, canActivate: [AuthGuard] },
  {
    path: 'questionnaire/wrong',
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
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class CoreRoutingModule { }
