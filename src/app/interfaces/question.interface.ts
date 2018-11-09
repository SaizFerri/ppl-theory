import { Answer } from './answer.interface';
import { Subject } from '../enum/subject.enum';
import { Lang } from '../enum/lang.enum';

export interface Question {
  id: string;
  questionId: number;
  lang: Lang;
  subject: Subject;
  question: string;
  asset: string;
  answers: Answer[];
}
