import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { QuestionComponent } from './question/question.component';
import { WrongQuestionnaireComponent } from './wrong-questionnaire/wrong-questionnaire.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: ':subject/:id', component: QuestionnaireComponent },
  { path: 'wrong/:subject/:id', component: WrongQuestionnaireComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
