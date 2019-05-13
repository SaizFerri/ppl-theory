import { State, Action, StateContext, NgxsOnInit, createSelector } from '@ngxs/store';
import { FetchWrongAnsweredQuestions, FetchQuestions, AddAnsweredQuestionToFirebase } from '../actions/questionnaire.actions';

import { tap, switchMap, withLatestFrom, filter, map } from 'rxjs/operators';

import { QuestionsService } from '../services/questions.service';
import { Question } from '../interfaces/question.interface';
import { WrongAnsweredQuestion } from '../interfaces/wrongAnsweredQuestion.interface';
import { AuthService } from '../services/auth.service';
import { Subject } from '../enum/subject.enum';
import { Collection } from '../enum/collection.enum';
import { LanguageService } from '@app/core/services/language.service';

export interface QuestionnaireStateModel {
  questions: Question[];
  wrongAnsweredQuestions: WrongAnsweredQuestion[];
}

@State<QuestionnaireStateModel>({
  name: 'questionnaire',
  defaults: {
    questions: [],
    wrongAnsweredQuestions: []
  }
})
export class QuestionnaireState implements NgxsOnInit {

  constructor(
    private questionsService: QuestionsService,
    private languageService: LanguageService,
    private authService: AuthService
  ) {}

  /**
   * Returns all the questions from the state from a specific subject
   * @param subject
   */
  static questionsBySubject(subject: Subject) {
    return createSelector([QuestionnaireState], (state: QuestionnaireStateModel): Question[] => {
      return state.questions.filter(question => question.subject === subject);
    });
  }

  /**
   * Returns all the wrong answered questions from the state from a specific subject
   * @param subject
   */
  static wrongAnsweredBySubject(subject: Subject) {
    return createSelector([QuestionnaireState], (state: QuestionnaireStateModel): WrongAnsweredQuestion[] => {
      return state.wrongAnsweredQuestions.filter(question => question.subject === subject);
    });
  }

  /**
   * Returns all the wrong answered questions from the state from a specific subject
   * @param subject
   */
  static checkIfExistsInFirebase(question: Question) {
    return createSelector([QuestionnaireState], (state: QuestionnaireStateModel) => {
      return state.wrongAnsweredQuestions.find(questionToCompare => {
        return questionToCompare.questionId === question.id;
      });
    });
  }

  /**
   * Returns the question by id
   * @param id
   */
  static questionById(id: string) {
    return createSelector([QuestionnaireState], (state: QuestionnaireStateModel) => {
      return state.questions.find(questionToCompare => {
        return questionToCompare.id === id;
      });
    });
  }

  /**
   * Fill the state with the inital data
   * @param ctx
   */
  ngxsOnInit(ctx: StateContext<QuestionnaireStateModel>) {
    ctx.dispatch([
      new FetchQuestions(),
      new FetchWrongAnsweredQuestions()
    ]);
  }


  @Action(FetchQuestions)
  fetchQuestions(ctx: StateContext<QuestionnaireStateModel>) {
    return this.questionsService.getQuestions(`questions.json`)
      .pipe(
        withLatestFrom(this.languageService.lang),
        map(([fetchedQuestions, lang]) => {
          return fetchedQuestions.filter(question => question.lang === lang);
        }),
        tap(fetchedQuestions => {
          ctx.patchState({
            questions: fetchedQuestions
          });
        })
      );
  }

  @Action(FetchWrongAnsweredQuestions)
  async fetchWrongAnsweredQuestions(ctx: StateContext<QuestionnaireStateModel>) {
    const user = await this.authService.isLoggedIn();

    if (user) {
      return this.questionsService.fireGetAllWrong(user)
      .subscribe(fetchedQuestions => {
        ctx.patchState({
          wrongAnsweredQuestions: fetchedQuestions
        });
      });
    }
  }

  @Action(AddAnsweredQuestionToFirebase)
  addAnsweredQuestionToFirebase(ctx: StateContext<QuestionnaireStateModel>, action: AddAnsweredQuestionToFirebase) {
    return this.questionsService.fireAddToWrongAnsweredCollection(action.question, Collection.WRONG);
  }
}
