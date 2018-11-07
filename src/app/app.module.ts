import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MatButtonModule, MatRadioModule, MatListModule, MatInputModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';

import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { QuestionnaireState } from './states/questionnaire.state';

import { AppComponent } from './app.component';
import { QuestionComponent } from './components/question/question.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { QuestionnaireComponent } from './components/questionnaire/questionnaire.component'
import { environment } from '../environments/environment';
import { WrongQuestionnaireComponent } from './components/wrong-questionnaire/wrong-questionnaire.component';
import { QuestionnaireMenuComponent } from './components/questionnaire-menu/questionnaire-menu.component';
import { WrongQuestionComponent } from './components/wrong-question/wrong-question.component';
import { WrongQuestionnaireMenuComponent } from './components/wrong-questionnaire-menu/wrong-questionnaire-menu.component';
import { WrongWrapperComponent } from './components/wrong-wrapper/wrong-wrapper.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { AuthGuard } from './services/auth-guard.service';

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
    WrongWrapperComponent,
    UserLoginComponent
  ],
  imports: [
    BrowserModule,
    NgxsModule.forRoot([
      QuestionnaireState
    ]),
    NgxsLoggerPluginModule.forRoot({disabled: environment.production}),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule, 
    MatRadioModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
