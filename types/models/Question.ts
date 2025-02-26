import { Question } from "@prisma/client";
import { Answer } from "@/types/models/Answer";
import { JsonObject } from "@prisma/client/runtime/library";
import { AttemptEntity } from "./Attempt";

export class QuestionEntity implements Partial<Omit<Question, "correctAnswer" | "answerOptions" | "createdAt" | "updatedAt">> {
  id?: string;
  content!: string;
  quizId?: string;
  attemptEntry?: AttemptEntity[];
  answerOptions: Answer[] = [];
  correctAnswer: Answer[] = [];

  constructor(param: string | Question) {
    if (typeof param === "string") {
      // If a string is provided, initialize with content only
      this.content = param;
      this.answerOptions = [];
      this.correctAnswer = [];
    }
    else{
      Object.assign(this, param);

      try {
        this.answerOptions = Array.isArray(param.answerOptions)
        ? param.answerOptions.map((option: JsonObject) => Answer.deserialize(JSON.stringify(option)))
        : JSON.parse(param.answerOptions || "[]").map((option: JsonObject) => Answer.deserialize(JSON.stringify(option)));

    this.correctAnswer = Array.isArray(param.correctAnswer)
        ? param.correctAnswer.map((ans: JsonObject) => Answer.deserialize(JSON.stringify(ans)))
        : JSON.parse(param.correctAnswer || "[]").map((ans: JsonObject) => Answer.deserialize(JSON.stringify(ans)));
      } catch (error) {
        this.answerOptions = [];
        this.correctAnswer = [];
      }
    }
  }
}
