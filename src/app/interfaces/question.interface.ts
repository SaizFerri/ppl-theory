import { Answer } from "./answer.interface";

export interface Question {
  id: number,
  question: string,
  answers: Answer[]
}