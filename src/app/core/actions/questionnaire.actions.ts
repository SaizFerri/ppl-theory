import { Question } from '@app/core/interfaces/question.interface';

export class FetchQuestions {
  static readonly type = '[Questionnaire] FetchQuestions';
}

export class FetchWrongAnsweredQuestions {
  static readonly type = '[Questionnaire] FetchWrongAnsweredQuestions';
}

export class AddAnsweredQuestionToFirebase {
  static readonly type = '[Questionnaire] AddAnsweredQuestionToFirebase';
  constructor(public question: Question) {}
}
