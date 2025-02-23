import React, { useState } from "react";
import { QuestionEntity } from "@/types/models/Question";
import { Answer } from "@/types/models/Answer";

type Props = {
  question: QuestionEntity;
  handleAnswer: (selectedOption: Answer) => void;
};

const Question = ({ question, handleAnswer }: Props) => {
  console.log("Type of question.answerOptions:", typeof question.answerOptions);
  console.log("Value of question.answerOptions:", question.answerOptions);
  
  return (
    <div>
      <div className="flex flex-col justify-center h-[90vh]">
        <div className="lg:w-6/12 w-10/12 mx-auto px-10 py-16 outline outline-slate-300 outline-2 rounded-3xl shadow-xl">
          <h1 className="font-black font-Inter mb-6 drop-shadow-sm text-4xl">
            {question.content}
          </h1>
          {
          question && (
            <>
              {question.answerOptions.map((option, index) => {
                return (
                  <p
                    className=" font-medium drop-shadow-sm my-2 bg-teal-600 text-white p-3 rounded-xl pl-5 hover:bg-teal-700 transition-all cursor-pointer"
                    onClick={async () => {
                      () => handleAnswer(option)
                    }}
                  >
                    {option.content}
                  </p>
                );
              })}
            </>
          )}
          <br />
          <hr />
          <br />
        </div>
      </div>
    </div>
  );
};

export default Question;