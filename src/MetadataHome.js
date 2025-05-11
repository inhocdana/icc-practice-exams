import React from "react";
import { useNavigate } from "react-router-dom";
import examsMetadata from "./exams/examsMetadata";

function MetadataHome() {
  const navigate = useNavigate();

  const handleExamClick = (examId) => {
    navigate(`/exam/${examId}`);
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-3xl font-bold mb-6">Select a Metadata-Based Exam</h1>
      {examsMetadata.map((exam) => (
        <button
          key={exam.id}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={() => handleExamClick(exam.id)}
        >
          {exam.title}
        </button>
      ))}
    </div>
  );
}

export default MetadataHome;
