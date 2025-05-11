import { Link } from "react-router-dom";
import SmartPayPalButton from "./components/SmartPayPalButton";
import { useState, useMemo } from "react";
import { useUser } from "./UserContext";
import exams from "./exams";

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function Home() {
  const { user } = useUser();

  const [quizState, setQuizState] = useState({
    view: "home",
    selectedExam: null,
    selectedChapter: null,
    selectedSection: null,
    currentQuestionIndex: 0,
    userAnswers: [],
  });

  const {
    view,
    selectedExam,
    selectedChapter,
    selectedSection,
    currentQuestionIndex,
    userAnswers,
  } = quizState;

  function startExam(examId) {
    const exam = exams[examId];
    setQuizState((prev) => ({
      ...prev,
      selectedExam: exam,
      view: "selectChapter",
    }));
  }

  function selectChapter(chapterKey) {
    const chapter = quizState.selectedExam.chapters[chapterKey];

    if (Object.keys(chapter.sections).length === 0) {
      setQuizState((prev) => ({
        ...prev,
        selectedChapter: chapter,
        view: "message",
      }));
    } else {
      setQuizState((prev) => ({
        ...prev,
        selectedChapter: chapter,
        view: "selectSection",
      }));
    }
  }

  function selectSection(sectionKey) {
    const section = quizState.selectedChapter.sections[sectionKey];
    const shuffledQuestions = shuffleArray(section.questions);
    setQuizState((prev) => ({
      ...prev,
      selectedSection: { ...section, questions: shuffledQuestions },
      currentQuestionIndex: 0,
      userAnswers: [],
      view: "quiz",
    }));
  }

  function selectFullChapter() {
    const allQuestions = Object.values(selectedChapter.sections).flatMap(
      (section) => section.questions || []
    );

    if (allQuestions.length === 0) {
      alert("No questions available for this chapter.");
      return;
    }

    const shuffledQuestions = shuffleArray(allQuestions).slice(0, 25);

    setQuizState((prev) => ({
      ...prev,
      selectedSection: {
        title: `${selectedChapter.title} - Full Chapter Test`,
        questions: shuffledQuestions,
      },
      currentQuestionIndex: 0,
      userAnswers: [],
      view: "quiz",
    }));
  }

  function selectFullBook() {
    const chapterKeys = Object.keys(selectedExam.chapters);
    const desiredTotal = 25;
    const questionsPerChapter = Math.floor(desiredTotal / chapterKeys.length);
    let allSelectedQuestions = [];

    chapterKeys.forEach((chapterKey) => {
      const chapter = selectedExam.chapters[chapterKey];
      const chapterQuestions = Object.values(chapter.sections || {}).flatMap(
        (section) => section.questions || []
      );
      const selected = shuffleArray(chapterQuestions).slice(
        0,
        questionsPerChapter
      );
      allSelectedQuestions.push(...selected);
    });

    if (allSelectedQuestions.length < desiredTotal) {
      const allQuestions = chapterKeys.flatMap((chapterKey) => {
        const chapter = selectedExam.chapters[chapterKey];
        return Object.values(chapter.sections || {}).flatMap(
          (section) => section.questions || []
        );
      });

      const remainingQuestions = allQuestions.filter(
        (q) => !allSelectedQuestions.includes(q)
      );

      const extras = shuffleArray(remainingQuestions).slice(
        0,
        desiredTotal - allSelectedQuestions.length
      );
      allSelectedQuestions.push(...extras);
    }

    const shuffledQuestions = shuffleArray(allSelectedQuestions);

    setQuizState((prev) => ({
      ...prev,
      selectedSection: {
        title: `${selectedExam.title} - Full Book Test`,
        questions: shuffledQuestions,
      },
      currentQuestionIndex: 0,
      userAnswers: [],
      view: "quiz",
    }));
  }

  function handleAnswer(selectedOptionIndex) {
    const currentQuestion = selectedSection.questions[currentQuestionIndex];
    const newAnswers = [
      ...userAnswers,
      { question: currentQuestion, selectedOptionIndex },
    ];
    const nextQuestionIndex = currentQuestionIndex + 1;
    const isLastQuestion =
      nextQuestionIndex >= selectedSection.questions.length;

    setQuizState((prev) => ({
      ...prev,
      userAnswers: newAnswers,
      currentQuestionIndex: isLastQuestion
        ? prev.currentQuestionIndex
        : nextQuestionIndex,
      view: isLastQuestion ? "results" : "quiz",
    }));
  }

  function startOver() {
    setQuizState({
      view: "home",
      selectedExam: null,
      selectedChapter: null,
      selectedSection: null,
      currentQuestionIndex: 0,
      userAnswers: [],
    });
  }

  // Memoize the exams buttons to prevent unnecessary re-renders
  // const examButtons = useMemo(() => {
  //   return Object.keys(exams).map((examId) => (
  //     <div key={examId} className="my-4 flex flex-col items-center">
  //       <Link
  //         to={`/exams/${examId}`}
  //         className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition duration-300 ease-in-out transform hover:scale-105"
  //       >
  //         {exams[examId].title}
  //       </Link>
  //       {examId === "ipmc2021" && user && (
  //         <div className="mt-2 w-[250px]" key={`paypal-${user.id}`}>
  //           <SmartPayPalButton />
  //         </div>
  //       )}
  //     </div>
  //   ));
  // }, [user?.id]); // Only re-render when user ID changes

  if (view === "home") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-4xl font-bold mb-6">ICC Practice Exams</h1>
        <p className="mb-6 text-lg max-w-xl">Select an exam to begin.</p>
        {Object.keys(exams).map((examId) => (
          <div key={examId} className="my-4 flex flex-col items-center">
            <Link
              to={`/exams/${examId}`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition duration-300 ease-in-out transform hover:scale-105"
            >
              {exams[examId].title}
            </Link>

            {examId === "ipmc2021" && (
              <div className="mt-2 w-[250px]">
                <SmartPayPalButton />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // ... (keep all other view checks the same as before)

  return null;
}
