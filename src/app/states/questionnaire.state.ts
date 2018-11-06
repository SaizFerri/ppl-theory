import { State, Action, StateContext, NgxsOnInit, Selector, createSelector } from '@ngxs/store';
import { FetchWrongAnsweredQuestions, FetchQuestions } from '../actions/questionnaire.actions';

import { tap } from 'rxjs/operators';

import { QuestionsService } from '../services/questions.service';
import { Question } from '../interfaces/question.interface';
import { WrongAnsweredQuestion } from '../interfaces/wrongAnsweredQuestion.interface';
import { AuthService } from '../services/auth.service';
import { Subject } from '../enum/subject.enum';

export interface QuestionnaireStateModel {
  questions: Question[];
  wrongAnsweredQuestions: WrongAnsweredQuestion[];
  // Make own interface
  savedQuestions: WrongAnsweredQuestion[];
}

@State<QuestionnaireStateModel>({
  name: 'questionnaire',
  defaults: {
    questions: [],
    wrongAnsweredQuestions: [],
    savedQuestions: []
  }
})
export class QuestionnaireState implements NgxsOnInit {
  constructor(private questionsService: QuestionsService, private authService: AuthService) {}

  ngxsOnInit(ctx: StateContext<QuestionnaireStateModel>) {
    ctx.dispatch([
      new FetchQuestions(),
      //new FetchWrongAnsweredQuestions()
    ]);
  }
  
  /**
   * Returns all the questions from the state from a specific subject
   * @param subject 
   */
  static questionsBySubject(subject: Subject) {
    return createSelector([QuestionnaireState], (state: QuestionnaireStateModel) => {
      return state.questions.filter(question => question.subject === subject);
    });
  }

  /**
   * Returns all the wrong answered questions from the state from a specific subject
   * @param subject 
   */
  static wrongAnsweredBySubject(subject: Subject) {
    return createSelector([QuestionnaireState], (state: QuestionnaireStateModel) => {
      return state.wrongAnsweredQuestions.filter(question => question.subject === subject);
    });
  }

  /**
   * Returns all the wrong answered questions from the state from a specific subject
   * @param subject 
   */
  static checkIfExistsInFirebase(question: Question) {
    return createSelector([QuestionnaireState], (state: QuestionnaireStateModel) => {
      return state.wrongAnsweredQuestions.find(questionToCompare => questionToCompare.questionId === question.id);
    });
  }

  @Action(FetchQuestions)
  fetchQuestions(ctx: StateContext<QuestionnaireStateModel>) {
    return this.questionsService.getQuestions(`questions.json`)
      .pipe(
        tap(fetchedQuestions => {
          const state = ctx.getState();
          ctx.patchState({
            questions: fetchedQuestions
          })
        })
      );
  }

  @Action(FetchWrongAnsweredQuestions)
  async fetchWrongAnsweredQuestions(ctx: StateContext<QuestionnaireStateModel>) {
    const user = await this.authService.isLoggedIn();
    return this.questionsService.fireGetAllWrong(user)
      .subscribe(fetchedQuestions => {
        ctx.patchState({
          wrongAnsweredQuestions: fetchedQuestions
        });
      });
  }
}