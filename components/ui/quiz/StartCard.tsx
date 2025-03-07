import { QuizEntity } from "@/types/models/Quiz";
import React from "react";

type Props = {
  quiz: QuizEntity;
  handleState: (selectedOption: string) => void;
};

const StartCard = ({ quiz, handleState }: Props) => {
  return (
    <div className="flex flex-col justify-center h-[90vh]">
      <div className="lg:w-6/12 w-10/12 mx-auto px-10 py-16 outline outline-slate-300 outline-2 rounded-3xl shadow-xl">
        <h1 className="font-black font-Inter mb-6 drop-shadow-sm">
          {quiz.title}
        </h1>
        <p className=" font-medium drop-shadow-sm mb-5">
          {quiz.description}
        </p>
        <p className=" font-medium drop-shadow-sm mb-4">
          {quiz.authorname}
        </p>
        <button className="bg-teal-600 text-white px-3 py-3 rounded-lg hover:bg-green-900 transition-all shadow-md" onClick={() => {handleState("quiz");}}>
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default StartCard;