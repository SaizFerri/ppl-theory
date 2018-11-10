import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from '@app/core/components/start/start.component';
import { QuestionnaireComponent } from '@app/core/components/questionnaire/questionnaire.component';
import { WrongQuestionnaireMenuComponent } from '@app/core/components/wrong-questionnaire-menu/wrong-questionnaire-menu.component';
import { WrongQuestionnaireComponent } from '@app/core/components/wrong-questionnaire/wrong-questionnaire.component';
import { WrongWrapperComponent } from '@app/core/components/wrong-wrapper/wrong-wrapper.component';
import { UserLoginComponent } from '@app/core/components/user-login/user-login.component';
import { AuthGuard } from '@app/core/services/auth-guard.service';

const routes: Routes = [
  { path: '', loadChildren: '@app/core#CoreModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
