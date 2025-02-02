import { motion } from "framer-motion";
import PropTypes from "prop-types";

const Question = ({
  data,
  onAnswer,
  current,
  total,
  showSolution,
  answered,
  onNext,
}) => {
  const handleAnswer = (description) => {
    onAnswer(description);
  };

  if (!data || !data.description || !data.options.length) {
    return (
      <div className="text-red-500 text-center">Invalid question data.</div>
    );
  }

  return (
    <motion.div
      key={current} // To trigger animation on question change
      className="w-full w-[600px] bg-white p-8 rounded-xl shadow-2xl text-center overflow-y-auto max-h-[80vh]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 1 }}
    >
      {!answered ? (
        <>
          <p className="text-2xl font-bold text-gray-700 mb-6">
            {data.description}
          </p>
          <div className="space-y-4">
            {data.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.description)}
                className="w-full px-6 py-3 bg-green-600 text-white font-bold text-xl rounded-lg hover:bg-green-500 transition duration-300 transform hover:scale-105"
              >
                {option.description}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mt-6 bg-gray-100 p-6 rounded-lg text-left text-gray-800">
            <h3 className="text-3xl font-bold text-center">
              Detailed Solution
            </h3>
            <p className="text-lg mt-4">{data.detailed_solution}</p>
            <style>
              {`
      .overflow-y-auto::-webkit-scrollbar {
        display: none;
      }
    `}
            </style>
          </div>
          {showSolution && (
            <button
              onClick={onNext}
              className="mt-6 px-6 py-3 bg-green-600 text-white font-bold text-xl rounded-lg hover:bg-green-500 transition duration-300"
            >
              {current === total - 1 ? "Finish" : "Next Question"}
            </button>
          )}
        </>
      )}
    </motion.div>
  );
};

Question.propTypes = {
  data: PropTypes.shape({
    description: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
        is_correct: PropTypes.bool.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onAnswer: PropTypes.func.isRequired,
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  showSolution: PropTypes.bool.isRequired,
  answered: PropTypes.bool.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default Question;
