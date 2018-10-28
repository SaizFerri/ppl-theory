import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { WrongQuestionnaireMenuComponent } from './wrong-questionnaire-menu/wrong-questionnaire-menu.component';
import { WrongQuestionnaireComponent } from './wrong-questionnaire/wrong-questionnaire.component';
import { WrongWrapperComponent } from './wrong-wrapper/wrong-wrapper.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: ':subject/:id', component: QuestionnaireComponent },
  { 
    path: 'wrong', 
    component: WrongWrapperComponent,
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
