import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { QuestionComponent } from './question/question.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { HttpClientModule }    from '@angular/common/http';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatRadioModule, MatListModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { WrongQuestionnaireComponent } from './wrong-questionnaire/wrong-questionnaire.component';
import { QuestionnaireMenuComponent } from './questionnaire-menu/questionnaire-menu.component';
import { WrongQuestionComponent } from './wrong-question/wrong-question.component';
import { WrongQuestionnaireMenuComponent } from './wrong-questionnaire-menu/wrong-questionnaire-menu.component';
import { WrongWrapperComponent } from './wrong-wrapper/wrong-wrapper.component';

@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    HomeComponent,
    QuestionnaireComponent,
    WrongQuestionnaireComponent,
    QuestionnaireMenuComponent,
    WrongQuestionComponent,
    WrongQuestionnaireMenuComponent,
    WrongWrapperComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule, 
    MatRadioModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
