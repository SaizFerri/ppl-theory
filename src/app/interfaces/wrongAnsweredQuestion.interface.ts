import { Subject } from '../enum/subject.enum';
import { Lang } from '../enum/lang.enum';

export interface WrongAnsweredQuestion {
  userId: string;
  questionId: string;
  questionNumber: number;
  subject: Subject;
  lang: Lang;
}
