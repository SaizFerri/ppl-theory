import { Subject } from '@app/core/enum/subject.enum';
import { Lang } from '@app/core/enum/lang.enum';

export interface WrongAnsweredQuestion {
  userId: string;
  questionId: string;
  questionNumber: number;
  subject: Subject;
  lang: Lang;
}
