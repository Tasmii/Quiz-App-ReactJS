import { useState, useEffect, useRef } from "react";
import Question from "./Question";
import Result from "./Result";

const API_URL = "https://api.allorigins.win/get?url=https://api.jsonserve.com/Uw5CrX";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [timer, setTimer] = useState(30); // 30 seconds timer
  const [timerRunning, setTimerRunning] = useState(false);
  const tickSoundRef = useRef(new Audio("/tick.mp3"));

  // Fetch quiz data from API
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch questions");

      const result = await response.json();
      const questionsData = JSON.parse(result.contents);

      if (!Array.isArray(questionsData.questions) || questionsData.questions.length === 0) {
        throw new Error("No questions found in API response.");
      }

      setQuestions(questionsData.questions);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Timer + Tick Sound Effect
  useEffect(() => {
    let timerId;

    if (timerRunning && timer > 0) {
      tickSoundRef.current.play().catch(() => {}); // Prevent autoplay issues
      tickSoundRef.current.loop = true;

      timerId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      tickSoundRef.current.pause();
      tickSoundRef.current.currentTime = 0;
    }

    if (timer === 0) {
      setShowSolution(true);
      setAnswered(true);
      setTimerRunning(false);
    }

    return () => clearInterval(timerId);
  }, [timer, timerRunning]);

  const handleAnswer = (selectedOption) => {
    if (!questions.length) return;

    const correctOption = questions[currentQuestion].options.find((opt) => opt.is_correct);
    if (selectedOption === correctOption.description) {
      setScore((prevScore) => prevScore + 1);
    }

    setAnswered(true);
    setShowSolution(true);
    setTimerRunning(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
      setShowSolution(false);
      setAnswered(false);
      setTimer(30);
      setTimerRunning(true);
    } else {
      setShowResult(true);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setTimerRunning(true);
  };

  if (loading) return <div className="text-white text-center">Loading questions...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const progress = quizStarted ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="absolute top-4 left-4 text-4xl text-white font-bold italic tracking-wider">
        Quizzard
      </h1>

      {/* Progress Bar */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-1/2">
        <div className="w-full bg-gray-300 h-4 rounded-full">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${progress}%`, transition: "width 1s linear" }}
          />
        </div>
      </div>

      {/* Timer Display with Dynamic Color */}
      <div className={`absolute top-4 right-4 text-3xl font-bold ${timer <= 5 ? "text-red-500" : "text-white"}`}>
        Timer: {timer}s
      </div>

      {!quizStarted ? (
        <div className="text-center">
          <h1 className="text-6xl mb-6 font-extrabold text-white text-shadow-lg">Welcome to Quizzard!</h1>
          <button
            onClick={startQuiz}
            className="px-6 py-3 bg-green-600 text-white font-bold text-xl rounded-lg hover:bg-green-500 transition duration-300"
          >
            Start Quiz
          </button>
        </div>
      ) : showResult ? (
        <Result score={score} totalQuestions={questions.length} />
      ) : (
        <div className="max-w-2xl w-full">
          <Question
            data={questions[currentQuestion] || { description: "", options: [] }}
            onAnswer={handleAnswer}
            current={currentQuestion}
            total={questions.length}
            showSolution={showSolution}
            answered={answered}
            onNext={handleNextQuestion}
          />
        </div>
      )}
    </div>
  );
};

export default Quiz;
