import { Question } from "@prisma/client";
import { Answer } from "@/types/models/Answer";
import { JsonObject } from "@prisma/client/runtime/library";

export class QuestionEntity implements Omit<Question, "correctAnswer" | "answerOptions" | "createdAt" | "updatedAt"> {
  id!: string;
  content!: string;
  quizId!: string;
  attemptEntry!: any[];
  answerOptions!: Answer[];
  correctAnswer!: Answer[];

  constructor(question: Question) {
    Object.assign(this, question);

    try {
      this.answerOptions = JSON.parse(question.answerOptions).map(
        (option: JsonObject) =>{
          return Answer.deserialize(JSON.stringify(option))
        }
      );
      this.correctAnswer = JSON.parse(question.correctAnswer).map(
        (ans: JsonObject) =>{
          return Answer.deserialize(JSON.stringify(ans))
        }
      );
    } catch (error) {
      this.answerOptions = [];
      this.correctAnswer = [];
    }
  }

  isCorrect(answer: Answer): boolean {
    return true;
  }
}
