import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ipmc2021_sample_full from "./exams/ipmc2021_sample";

const examData = {
  ipmc2021_sample: ipmc2021_sample_full,
  // more exams can be added here
};

function ExamPage() {
  const { examId } = useParams();
  const exam = examData[examId];

  const [questions, setQuestions] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [openChapter, setOpenChapter] = useState(null);

  if (!exam) {
    return <div>Exam not found.</div>;
  }

  const getRandomItems = (items, maxCount) => {
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, maxCount);
  };

  const handleFullBookTest = () => {
    const chapterQuestions = Object.values(exam.chapters).flatMap((chapter) =>
      Object.values(chapter.sections || {}).flatMap((section) => section.questions)
    );
    const selected = getRandomItems(chapterQuestions, 25);
    setQuestions(selected);
    setUserAnswers({});
  };

  const handleFullChapterTest = (chapterKey) => {
    const chapter = exam.chapters[chapterKey];
    if (!chapter) return;
    const sectionQuestions = Object.values(chapter.sections || {}).flatMap(
      (section) => section.questions
    );
    const selected = getRandomItems(sectionQuestions, 25);
    setQuestions(selected);
    setUserAnswers({});
  };

  const handleSectionTest = (chapterKey, sectionKey) => {
    const section = exam.chapters[chapterKey]?.sections[sectionKey];
    if (!section) return;
    const selected = getRandomItems(section.questions, 25);
    setQuestions(selected);
    setUserAnswers({});
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  if (questions) {
    return (
      <div className="flex flex-col items-center mt-8">
        <h1 className="text-3xl font-bold mb-6">Test</h1>
        <div className="w-full max-w-4xl">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-white shadow-md rounded p-4 mb-4 border border-gray-200"
            >
              <h2 className="font-semibold mb-2">
                {index + 1}. {q.question}
              </h2>
              <ul className="space-y-2">
                {q.options.map((option, idx) => {
                  const isSelected = userAnswers[q.id] === idx;
                  return (
                    <li key={idx}>
                      <button
                        className={`w-full text-left px-4 py-2 rounded border ${
                          isSelected
                            ? "bg-blue-100 border-blue-500"
                            : "bg-white border-gray-300 hover:bg-gray-100"
                        }`}
                        onClick={() => handleAnswerSelect(q.id, idx)}
                      >
                        {option}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-3xl font-bold mb-6">Select Test Type</h1>

      <button
        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded mb-6"
        onClick={handleFullBookTest}
      >
        Full IPMC 2021 Test
      </button>

      <div className="w-full max-w-4xl flex flex-col items-center">
        {Object.entries(exam.chapters).map(([chapterKey, chapter]) => (
          <div key={chapterKey} className="mb-8 flex flex-col items-center w-full">
            <button
              className="bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded mb-2 w-full"
              onClick={() => setOpenChapter(openChapter === chapterKey ? null : chapterKey)}
            >
              {chapter.title}
            </button>

            {openChapter === chapterKey && (
              <div className="flex flex-col items-center gap-2 mt-4">
                {chapter.sections && Object.keys(chapter.sections).length > 0 && (
                  <>
                    <button
                      className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded mb-2"
                      onClick={() => handleFullChapterTest(chapterKey)}
                    >
                      Test Full {chapter.title}
                    </button>
                    {Object.entries(chapter.sections).map(([sectionKey, section]) => (
                      <button
                        key={sectionKey}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleSectionTest(chapterKey, sectionKey)}
                      >
                        {section.title}
                      </button>
                    ))}
                  </>
                )}
                {chapter.message && (
                  <div className="text-center text-gray-600 p-4 border border-gray-300 rounded">
                    {chapter.message}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExamPage;
