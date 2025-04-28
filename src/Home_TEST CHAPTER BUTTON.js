import { useState } from "react";
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

  const { view, selectedExam, selectedChapter, selectedSection, currentQuestionIndex, userAnswers } = quizState;

  function startExam(examId) {
    setQuizState(prev => ({ ...prev, selectedExam: exams[examId], view: "selectChapter" }));
  }

  function selectChapter(chapterKey) {
    const chapter = quizState.selectedExam.chapters[chapterKey];

    if (Object.keys(chapter.sections).length === 0) {
      // No sections: show educational message
      setQuizState(prev => ({
        ...prev,
        selectedChapter: chapter,
        view: "message"
      }));
    } else {
      // Normal chapter with sections
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
  const allQuestions = Object.values(selectedChapter.sections)
    .flatMap(section => section.questions || []);

  if (allQuestions.length === 0) {
    alert("No questions available for this chapter.");
    return;
  }

  const shuffledQuestions = shuffleArray(allQuestions).slice(0, 25); // Limit to 25 questions

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


  function handleAnswer(selectedOptionIndex) {
    const currentQuestion = selectedSection.questions[currentQuestionIndex];
    const newAnswers = [...userAnswers, { question: currentQuestion, selectedOptionIndex }];
    const nextQuestionIndex = currentQuestionIndex + 1;
    const isLastQuestion = nextQuestionIndex >= selectedSection.questions.length;

    setQuizState(prev => ({
      ...prev,
      userAnswers: newAnswers,
      currentQuestionIndex: isLastQuestion ? prev.currentQuestionIndex : nextQuestionIndex,
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
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>ICC Practice Exams</h1>
        <p>Select an exam to begin.</p>
        {Object.keys(exams).map((examId) => (
          <div key={examId}>
            <button onClick={() => startExam(examId)}>
              {exams[examId].title}
            </button>
          </div>
        ))}
      </div>
    );
  }

  if (view === "selectChapter" && selectedExam) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Select a Chapter</h1>
        {Object.keys(selectedExam.chapters).map((chapterKey) => (
          <div key={chapterKey}>
            <button onClick={() => selectChapter(chapterKey)}>
              {selectedExam.chapters[chapterKey].title}
            </button>
          </div>
        ))}
      </div>
    );
  }

  if (view === "selectSection" && selectedChapter) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>{selectedChapter.title}</h1>
        <p>Select a Section</p>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={selectFullChapter}>
          Test Full Chapter
        </button>
      </div>

        {Object.keys(selectedChapter.sections).map((sectionKey) => (
          <div key={sectionKey}>
            <button onClick={() => selectSection(sectionKey)}>
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
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>{selectedSection.title}</h1>
        <p>Question {currentQuestionIndex + 1} of {selectedSection.questions.length}</p>
        <h2>{question.question}</h2>
        {question.options.map((option, idx) => (
          <div key={idx}>
            <button onClick={() => handleAnswer(idx)}>{option}</button>
          </div>
        ))}
      </div>
    );
  }

  if (view === "results" && selectedSection) {
    const correctCount = userAnswers.filter(({ question, selectedOptionIndex }) => selectedOptionIndex === question.answer).length;
    const wrongAnswers = userAnswers.filter(({ question, selectedOptionIndex }) => selectedOptionIndex !== question.answer);

    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Quiz Results</h1>
        <p>Score: {correctCount} / {userAnswers.length}</p>

        {wrongAnswers.length > 0 ? (
          <div style={{ marginTop: "30px" }}>
            <h2>Questions you missed:</h2>
            {wrongAnswers.map(({ question, selectedOptionIndex }, idx) => (
              <div key={idx} style={{ marginBottom: "20px", backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "8px" }}>
                <p><strong>Question:</strong> {question.question}</p>
                <p style={{ color: "red" }}><strong>Your Answer:</strong> {question.options[selectedOptionIndex]}</p>
                <p style={{ color: "green" }}><strong>Correct Answer:</strong> {question.options[question.answer]}</p>
                <p><em>{question.explanation}</em></p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "green" }}>Perfect Score! Well done!</p>
        )}

        <button onClick={startOver} style={{ marginTop: "30px" }}>
          Restart
        </button>
      </div>
    );
  }

  if (view === "message" && selectedChapter) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", padding: "20px" }}>
        <h1>{selectedChapter.title}</h1>
        <p style={{ marginTop: "20px", fontSize: "18px", maxWidth: "700px", margin: "auto" }}>
          {selectedChapter.message}
        </p>
        <button 
          onClick={startOver}
          style={{ marginTop: "30px" }}
        >
          Return Home
        </button>
      </div>
    );
  }

  return null;
}
