import { useState, useEffect } from "react";
import exams from "./exams";

function shuffleArray(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function Home() {
  const [quizState, setQuizState] = useState({
    view: "home",
    selectedExam: null,
    selectedChapter: null,
    selectedSection: null,
    currentQuestionIndex: 0,
    userAnswers: []
  });

  const {
    view,
    selectedExam,
    selectedChapter,
    selectedSection,
    currentQuestionIndex,
    userAnswers
  } = quizState;

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=BAA1I-MDFhX3ipHCOrWxOxtmZkDXpHfzgMgHss7QShO08v26L8QEJbZzZLu9kESoLKuq_QdgjR8TJT3gC4&components=hosted-buttons&enable-funding=venmo&currency=USD";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  function startExam(examId) {
    setQuizState(prev => ({
      ...prev,
      selectedExam: exams[examId],
      view: "selectChapter"
    }));
  }

  function selectChapter(chapterKey) {
    const chapter = quizState.selectedExam.chapters[chapterKey];

    if (Object.keys(chapter.sections).length === 0) {
      setQuizState(prev => ({
        ...prev,
        selectedChapter: chapter,
        view: "message"
      }));
    } else {
      setQuizState(prev => ({
        ...prev,
        selectedChapter: chapter,
        view: "selectSection"
      }));
    }
  }

  function selectSection(sectionKey) {
    const section = quizState.selectedChapter.sections[sectionKey];
    const shuffledQuestions = shuffleArray(section.questions);
    setQuizState(prev => ({
      ...prev,
      selectedSection: { ...section, questions: shuffledQuestions },
      currentQuestionIndex: 0,
      userAnswers: [],
      view: "quiz"
    }));
  }

  function selectFullChapter() {
    const allQuestions = Object.values(selectedChapter.sections).flatMap(
      section => section.questions || []
    );

    if (allQuestions.length === 0) {
      alert("No questions available for this chapter.");
      return;
    }

    const shuffledQuestions = shuffleArray(allQuestions).slice(0, 25);

    setQuizState(prev => ({
      ...prev,
      selectedSection: {
        title: `${selectedChapter.title} - Full Chapter Test`,
        questions: shuffledQuestions
      },
      currentQuestionIndex: 0,
      userAnswers: [],
      view: "quiz"
    }));
  }

  function selectFullBook() {
    const chapterKeys = Object.keys(selectedExam.chapters);
    const desiredTotal = 25;
    const questionsPerChapter = Math.floor(desiredTotal / chapterKeys.length);
    let allSelectedQuestions = [];

    chapterKeys.forEach(chapterKey => {
      const chapter = selectedExam.chapters[chapterKey];
      const chapterQuestions = Object.values(chapter.sections || {}).flatMap(
        section => section.questions || []
      );
      const selected = shuffleArray(chapterQuestions).slice(
        0,
        questionsPerChapter
      );
      allSelectedQuestions.push(...selected);
    });

    if (allSelectedQuestions.length < desiredTotal) {
      const allQuestions = chapterKeys.flatMap(chapterKey => {
        const chapter = selectedExam.chapters[chapterKey];
        return Object.values(chapter.sections || {}).flatMap(
          section => section.questions || []
        );
      });

      const remainingQuestions = allQuestions.filter(
        q => !allSelectedQuestions.includes(q)
      );

      const extras = shuffleArray(remainingQuestions).slice(
        0,
        desiredTotal - allSelectedQuestions.length
      );
      allSelectedQuestions.push(...extras);
    }

    const shuffledQuestions = shuffleArray(allSelectedQuestions);

    setQuizState(prev => ({
      ...prev,
      selectedSection: {
        title: `${selectedExam.title} - Full Book Test`,
        questions: shuffledQuestions
      },
      currentQuestionIndex: 0,
      userAnswers: [],
      view: "quiz"
    }));
  }

  function handleAnswer(selectedOptionIndex) {
    const currentQuestion = selectedSection.questions[currentQuestionIndex];
    const newAnswers = [
      ...userAnswers,
      { question: currentQuestion, selectedOptionIndex }
    ];
    const nextQuestionIndex = currentQuestionIndex + 1;
    const isLastQuestion = nextQuestionIndex >= selectedSection.questions.length;

    setQuizState(prev => ({
      ...prev,
      userAnswers: newAnswers,
      currentQuestionIndex: isLastQuestion
        ? prev.currentQuestionIndex
        : nextQuestionIndex,
      view: isLastQuestion ? "results" : "quiz"
    }));
  }

  function startOver() {
    setQuizState({
      view: "home",
      selectedExam: null,
      selectedChapter: null,
      selectedSection: null,
      currentQuestionIndex: 0,
      userAnswers: []
    });
  }

  if (view === "home") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-4xl font-bold mb-6">ICC Practice Exams</h1>
        <p className="mb-6 text-lg max-w-xl">Select an exam to begin.</p>
        {Object.keys(exams).map((examId) => (
          <div key={examId} className="my-4">
            <button
              onClick={() => startExam(examId)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition duration-300 ease-in-out transform hover:scale-105"
            >
              {exams[examId].title}
            </button>

            {examId === "ipmc2021" && (
              <div className="mt-2">
                <div
                  id="paypal-hosted-button-id"
                  data-hosted-button-id="2HDC5ZZCEH5BE" // replace with your actual PayPal hosted button ID
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (view === "selectChapter" && selectedExam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-3xl font-bold mb-6">Select a Chapter</h1>
        <div className="my-4">
          <button
            onClick={selectFullBook}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded shadow transition duration-300 ease-in-out transform hover:scale-105"
          >
            Test Full Book (25 Random Questions)
          </button>
        </div>
        {Object.keys(selectedExam.chapters).map((chapterKey) => (
          <div key={chapterKey} className="my-2">
            <button
              onClick={() => selectChapter(chapterKey)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded shadow transition duration-300 ease-in-out transform hover:scale-105"
            >
              {selectedExam.chapters[chapterKey].title}
            </button>
          </div>
        ))}
      </div>
    );
  }

  if (view === "selectSection" && selectedChapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-3xl font-bold mb-6">{selectedChapter.title}</h1>
        <p className="mb-4">Select a Section</p>
        <div className="my-2">
          <button
            onClick={selectFullChapter}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded shadow transition duration-300 ease-in-out transform hover:scale-105"
          >
            Test Full Chapter (up to 25 Questions)
          </button>
        </div>
        {Object.keys(selectedChapter.sections).map((sectionKey) => (
          <div key={sectionKey} className="my-2">
            <button
              onClick={() => selectSection(sectionKey)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded shadow transition duration-300 ease-in-out transform hover:scale-105"
            >
              {selectedChapter.sections[sectionKey].title}
            </button>
          </div>
        ))}
      </div>
    );
  }

  if (view === "quiz" && selectedSection) {
    const question = selectedSection.questions[currentQuestionIndex];
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">{selectedSection.title}</h1>
        <p className="text-gray-700 mb-4">
          Question {currentQuestionIndex + 1} of {selectedSection.questions.length}
        </p>
        <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
        {question.options.map((option, idx) => (
          <div key={idx} className="my-2">
            <button
              onClick={() => handleAnswer(idx)}
              className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded shadow"
            >
              {option}
            </button>
          </div>
        ))}
      </div>
    );
  }

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
              <div
                key={idx}
                className="p-4 rounded border shadow bg-gray-50"
              >
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

        <div className="flex gap-4 mt-8">
          <button
            onClick={startOver}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded shadow"
          >
            Restart
          </button>
        </div>

        <div className="mt-10 text-sm text-gray-600">
          <p>
            Found an error in a question?{" "}
            <a
              href="mailto:help@iccpracticeexams.com"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Let us know
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  if (view === "message" && selectedChapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">{selectedChapter.title}</h1>
        <p className="mb-6 text-lg max-w-xl">{selectedChapter.message}</p>
        <button
          onClick={startOver}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded shadow"
        >
          Return Home
        </button>
      </div>
    );
  }

  return null;
}
