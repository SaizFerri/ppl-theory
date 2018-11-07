import { State, Action, StateContext, NgxsOnInit, createSelector } from '@ngxs/store';
import { FetchWrongAnsweredQuestions, FetchQuestions, AddAnsweredQuestionToFirebase } from '../actions/questionnaire.actions';

import { tap } from 'rxjs/operators';

import { QuestionsService } from '../services/questions.service';
import { Question } from '../interfaces/question.interface';
import { WrongAnsweredQuestion } from '../interfaces/wrongAnsweredQuestion.interface';
import { AuthService } from '../services/auth.service';
import { Subject } from '../enum/subject.enum';
import { Collection } from '../enum/collection.enum';

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
  constructor(private questionsService: QuestionsService, private authService: AuthService) {}

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

  @Action(FetchQuestions)
  fetchQuestions(ctx: StateContext<QuestionnaireStateModel>) {
    return this.questionsService.getQuestions(`questions.json`)
      .pipe(
        tap(fetchedQuestions => {
          ctx.patchState({
            questions: fetchedQuestions
          })
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