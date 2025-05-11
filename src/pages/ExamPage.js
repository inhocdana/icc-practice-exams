import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import exams from "../exams";
import { useUser } from "../UserContext";
import { supabase } from "../supabaseClient";

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function ExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizState, setQuizState] = useState({
    view: "selectChapter",
    selectedExam: examId && exams[examId] ? exams[examId] : null,
    selectedChapter: null,
    selectedSection: null,
    currentQuestionIndex: 0,
    userAnswers: [],
  });

  // Check if the exam exists and redirect if not
  useEffect(() => {
    if (!examId || !exams[examId]) {
      navigate("/");
    }
  }, [examId, navigate]);

  // Check if user has paid for this exam
  useEffect(() => {
    async function checkAccess() {
      if (!user?.id) return;

      if (examId === "ipmc2021") {
        const { data, error } = await supabase
          .from("exam_access")
          .select("ipmc2021_paid")
          .eq("user_id", user.id)
          .single();

        if (error || !data || !data.ipmc2021_paid) {
          alert("Please purchase this exam to access it.");
          navigate("/");
        }
      } else {
        alert("This exam is not available yet.");
        navigate("/");
      }
    }

    checkAccess();
  }, [examId, user?.id, navigate]);

  function selectChapter(chapterKey) {
    const chapter = quizState.selectedExam.chapters[chapterKey];

    if (!chapter.sections || Object.keys(chapter.sections).length === 0) {
      setQuizState({
        ...quizState,
        selectedChapter: chapter,
        view: "message",
      });
    } else {
      setQuizState({
        ...quizState,
        selectedChapter: chapter,
        view: "selectSection",
      });
    }
  }

  function selectSection(sectionKey) {
    const section = quizState.selectedChapter.sections[sectionKey];
    const shuffledQuestions = shuffleArray([...section.questions]);

    setQuizState({
      ...quizState,
      selectedSection: { ...section, questions: shuffledQuestions },
      currentQuestionIndex: 0,
      userAnswers: [],
      view: "quiz",
    });

    setSelectedAnswer(null);
  }

  function selectFullChapter() {
    const { selectedChapter } = quizState;
    const allQuestions = Object.values(selectedChapter.sections || {}).flatMap(
      (section) => section.questions || []
    );

    if (allQuestions.length === 0) {
      alert("No questions available for this chapter.");
      return;
    }

    const shuffledQuestions = shuffleArray([...allQuestions]).slice(0, 25);

    setQuizState({
      ...quizState,
      selectedSection: {
        title: `${selectedChapter.title} - Full Chapter Test`,
        questions: shuffledQuestions,
      },
      currentQuestionIndex: 0,
      userAnswers: [],
      view: "quiz",
    });

    setSelectedAnswer(null);
  }

  function selectFullBook() {
    const { selectedExam } = quizState;
    const allQuestions = Object.keys(selectedExam.chapters).flatMap(
      (chapterKey) => {
        const chapter = selectedExam.chapters[chapterKey];
        return Object.values(chapter.sections || {}).flatMap(
          (section) => section.questions || []
        );
      }
    );

    if (allQuestions.length === 0) {
      alert("No questions available.");
      return;
    }

    const shuffledQuestions = shuffleArray([...allQuestions]).slice(0, 25);

    setQuizState({
      ...quizState,
      selectedSection: {
        title: `${selectedExam.title} - Full Book Test`,
        questions: shuffledQuestions,
      },
      currentQuestionIndex: 0,
      userAnswers: [],
      view: "quiz",
    });

    setSelectedAnswer(null);
  }

  function submitAnswer() {
    if (selectedAnswer === null) return;

    const { selectedSection, currentQuestionIndex, userAnswers } = quizState;
    const currentQuestion = selectedSection.questions[currentQuestionIndex];

    // Add the answer to userAnswers
    const newAnswers = [
      ...userAnswers,
      {
        question: currentQuestion,
        selectedOptionIndex: selectedAnswer,
      },
    ];

    // Check if this is the last question
    const nextQuestionIndex = currentQuestionIndex + 1;
    const isLastQuestion =
      nextQuestionIndex >= selectedSection.questions.length;

    // Update state
    setQuizState({
      ...quizState,
      userAnswers: newAnswers,
      currentQuestionIndex: isLastQuestion
        ? currentQuestionIndex
        : nextQuestionIndex,
      view: isLastQuestion ? "results" : "quiz",
    });

    // Reset selected answer
    setSelectedAnswer(null);
  }

  function startOver() {
    setQuizState({
      ...quizState,
      view: "selectChapter",
      selectedChapter: null,
      selectedSection: null,
      currentQuestionIndex: 0,
      userAnswers: [],
    });
    setSelectedAnswer(null);
  }

  function goHome() {
    navigate("/");
  }

  // If the exam doesn't exist, show loading
  if (!quizState.selectedExam) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const {
    view,
    selectedExam,
    selectedChapter,
    selectedSection,
    currentQuestionIndex,
    userAnswers,
  } = quizState;

  // Chapter selection view
  if (view === "selectChapter") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-3xl font-bold mb-6">Select a Chapter</h1>

        <div className="my-4">
          <button
            onClick={selectFullBook}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded shadow"
          >
            Test Full Book (25 Random Questions)
          </button>
        </div>

        {Object.keys(selectedExam.chapters).map((chapterKey) => (
          <div key={chapterKey} className="my-2">
            <button
              onClick={() => selectChapter(chapterKey)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded shadow"
            >
              {selectedExam.chapters[chapterKey].title}
            </button>
          </div>
        ))}

        <div className="mt-6">
          <button
            onClick={goHome}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded shadow"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Section selection view
  if (view === "selectSection" && selectedChapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-3xl font-bold mb-6">{selectedChapter.title}</h1>
        <p className="mb-4">Select a Section</p>

        <div className="my-2">
          <button
            onClick={selectFullChapter}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded shadow"
          >
            Test Full Chapter (up to 25 Questions)
          </button>
        </div>

        {Object.keys(selectedChapter.sections || {}).map((sectionKey) => (
          <div key={sectionKey} className="my-2">
            <button
              onClick={() => selectSection(sectionKey)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded shadow"
            >
              {selectedChapter.sections[sectionKey].title}
            </button>
          </div>
        ))}

        <div className="mt-6">
          <button
            onClick={startOver}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded shadow"
          >
            Back to Chapters
          </button>
        </div>
      </div>
    );
  }

  // Quiz view
  if (view === "quiz" && selectedSection && selectedSection.questions) {
    const question = selectedSection.questions[currentQuestionIndex];

    if (!question) {
      return <div>Error: Question not found</div>;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">{selectedSection.title}</h1>
        <p className="text-gray-700 mb-4">
          Question {currentQuestionIndex + 1} of{" "}
          {selectedSection.questions.length}
        </p>
        <h2 className="text-xl font-semibold mb-6">{question.question}</h2>

        {/* Answer options */}
        <div className="w-full max-w-xl">
          {question.options.map((option, idx) => (
            <div key={idx} className="my-2">
              <button
                onClick={() => setSelectedAnswer(idx)}
                className={`w-full text-left px-4 py-3 rounded shadow ${
                  selectedAnswer === idx
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 hover:bg-blue-200 text-gray-800"
                }`}
              >
                {option}
              </button>
            </div>
          ))}
        </div>

        {/* Submit button */}
        <button
          onClick={submitAnswer}
          disabled={selectedAnswer === null}
          className={`mt-8 px-6 py-3 rounded shadow font-semibold ${
            selectedAnswer === null
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          Submit Answer
        </button>
      </div>
    );
  }

  // Results view
  if (view === "results" && selectedSection) {
    const correctCount = userAnswers.filter(
      ({ question, selectedOptionIndex }) =>
        selectedOptionIndex === question.answer
    ).length;

    const wrongAnswers = userAnswers.filter(
      ({ question, selectedOptionIndex }) =>
        selectedOptionIndex !== question.answer
    );

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Quiz Results</h1>
        <p className="text-lg mb-6">
          Score: {correctCount} / {userAnswers.length}
        </p>

        {wrongAnswers.length > 0 ? (
          <div className="space-y-6 text-left max-w-xl">
            {wrongAnswers.map(({ question, selectedOptionIndex }, idx) => (
              <div key={idx} className="p-4 rounded border shadow bg-gray-50">
                <p className="font-semibold">{question.question}</p>
                <p className="text-red-500">
                  Your Answer: {question.options[selectedOptionIndex]}
                </p>
                <p className="text-green-600">
                  Correct Answer: {question.options[question.answer]}
                </p>
                <p className="italic mt-2">{question.explanation}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-green-500 font-extrabold text-3xl animate-bounce">
            Perfect Score! Well done!
          </p>
        )}

        <div className="mt-8">
          <button
            onClick={startOver}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    );
  }

  // Message view
  if (view === "message" && selectedChapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">{selectedChapter.title}</h1>
        <p className="mb-6 text-lg max-w-xl">{selectedChapter.message}</p>
        <button
          onClick={startOver}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded shadow"
        >
          Back to Chapters
        </button>
      </div>
    );
  }

  // Fallback
  return (
    <div className="flex justify-center items-center h-screen">Loading...</div>
  );
}
