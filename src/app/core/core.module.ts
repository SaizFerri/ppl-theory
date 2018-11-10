import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@app/shared';
import { environment } from '@env/environment';

import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AuthGuard, QuestionsService, AuthService, QuestionnaireState } from '@app/core';

import { StartComponent } from '@app/core/components/start/start.component';
import { QuestionnaireComponent } from '@app/core/components/questionnaire/questionnaire.component';
import { WrongQuestionnaireComponent } from '@app/core/components/wrong-questionnaire/wrong-questionnaire.component';
import { WrongQuestionnaireMenuComponent } from '@app/core/components/wrong-questionnaire-menu/wrong-questionnaire-menu.component';
import { WrongWrapperComponent } from '@app/core/components/wrong-wrapper/wrong-wrapper.component';
import { UserLoginComponent } from '@app/core/components/user-login/user-login.component';
import { QuestionComponent } from '@app/core/components/question/question.component';
import { QuestionnaireMenuComponent } from '@app/core/components/questionnaire-menu/questionnaire-menu.component';

@NgModule({
  declarations: [
    StartComponent,
    QuestionComponent,
    QuestionnaireComponent,
    QuestionnaireMenuComponent,
    WrongQuestionnaireComponent,
    WrongQuestionnaireMenuComponent,
    WrongWrapperComponent,
    UserLoginComponent
  ],
  imports: [
    NgxsModule.forRoot([
      QuestionnaireState
    ]),
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    SharedModule,
    RouterModule,
    HttpClientModule,
    CommonModule,
    FormsModule
  ],
  exports: [],
  providers: [
    QuestionsService,
    AuthService,
    AuthGuard
  ]
})
export class CoreModule {
  /* make sure CoreModule is imported only by one NgModule the AppModule */
  constructor (
    @Optional() @SkipSelf() parentModule: CoreModule
  ) {
    if (parentModule) {
        throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
