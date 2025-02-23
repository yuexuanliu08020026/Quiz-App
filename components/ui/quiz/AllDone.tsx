import React, { useState } from "react";
import { QuizEntity } from "@/types/models/Quiz";

type Props = {
  quiz: QuizEntity;
};

const AllDone = ({ quiz }: Props) => {
  const [name, setName] = useState("");

  return (
    <div>
      <div className="flex flex-col justify-center h-[90vh]">
        <div className="lg:w-6/12 w-10/12 mx-auto px-10 py-16 outline outline-slate-300 outline-2 rounded-3xl shadow-xl">
          <h1 className="font-black font-Inter mb-6 drop-shadow-sm">
            Congratulations! You done quiz!
          </h1>
          <p className=" font-medium drop-shadow-sm mb-5">
            Your Final Score is: {quiz.finalScore}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AllDone;