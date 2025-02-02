import PropTypes from "prop-types";

const Result = ({ score, totalQuestions }) => {
  return (
    <div className="w-full min-w-[600px] max-w-3xl bg-white p-8 rounded-xl shadow-2xl text-center">
      <h2 className="text-3xl font-bold text-gray-800">Quiz Completed!</h2>
      <p className="text-2xl mt-4 font-semibold text-gray-700">Your Score: {score} / {totalQuestions}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-6 py-3 bg-green-600 text-white font-bold text-xl rounded-lg hover:bg-green-500 transition duration-300"
      >
        Restart Quiz
      </button>
    </div>
  );
};

Result.propTypes = {
  score: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
};

export default Result;
