import React, { useState, useEffect } from "react";
import { QuestionEntity } from "@/types/models/Question";
import { Answer } from "@/types/models/Answer";

type Props = {
  question: QuestionEntity;
  registerRef: (getter: () => Answer[]) => void;
};

const Question = ({ question, registerRef }: Props) => {
  const [answers, setAnswers] = useState<Answer[]>(new Array<Answer>());

  useEffect(() => {
    registerRef(() => answers);
  }, [answers]);
  
  return (
    <div>
      <div className="flex flex-col justify-center h-[90vh]">
        <div className="lg:w-6/12 w-10/12 mx-auto px-10 py-16 outline outline-slate-300 outline-2 rounded-3xl shadow-xl">
          <h1 className="font-black font-Inter mb-6 drop-shadow-sm text-4xl">
            {question.content}
          </h1>
          {
              question?.answerOptions.map((option, index) => {
                const isSelected = answers.some((ans) => ans.id === option.id);
                return (
                  <p
                    className={` font-medium drop-shadow-sm my-2 ${isSelected ? "bg-teal-700":"bg-teal-600"} text-white p-3 rounded-xl pl-5 hover:bg-teal-700 transition-all cursor-pointer`}
                    onClick={() => {
                      setAnswers((prevAnswer) => {
                        console.log("Previous Answer:", prevAnswer);
                        return [option];
                      });
                    }}
                  >
                    {option.content}
                  </p>
                );
              })}
          <br />
          <hr />
          <br />
        </div>
      </div>
    </div>
  );
};

export default Question;