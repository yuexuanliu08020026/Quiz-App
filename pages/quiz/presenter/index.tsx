import React, { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [presenter, setPresenter] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!presenter) return alert("Please enter a presenter's username");

    setLoading(true);
    try {
      const res = await fetch(`/api/quiz/presenter/${presenter}`);
      const data = await res.json();

      if (res.ok && data.id) {
        router.push(`/quiz/${data.id}`);
      } else {
        alert("Presenter not found or quiz not published!");
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      alert("Failed to find quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center text-gray-900">
        <h1 className="text-2xl font-bold mb-6 flex items-center justify-center">
          Find Presenter
        </h1>
        <p className="text-lg mb-4">Join presentation</p>
        <div className="bg-white p-3 rounded-lg shadow-md w-80">
          <span className="text-gray-500 text-sm block text-left mb-1">
            QuizApp/
          </span>
          <input
            type="text"
            placeholder="Presenter's username"
            value={presenter}
            onChange={(e) => setPresenter(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleJoin}
          disabled={loading}
          className={`mt-4 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } text-white py-2 px-6 rounded-lg text-lg`}
        >
          {loading ? "Finding..." : "Join"}
        </button>
      </div>
    </div>
  );
}
