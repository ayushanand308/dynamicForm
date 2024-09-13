import React from 'react';

const FormSubmissionView = ({ questions }) => {
  return (
    <div className="p-4 sm:p-6 bg-white rounded-md shadow-md max-w-2xl mx-auto">
      {/* Adjusted padding for smaller screens */}
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-5 text-center">Form Submission Review</h2>
      {questions.length > 0 ? (
        <div className="space-y-4">
          {renderQuestions(questions, '')} {/* Start numbering without a prefix for root questions */}
        </div>
      ) : (
        <p className="text-gray-500">No questions submitted yet.</p>
      )}
    </div>
  );
};

const renderQuestions = (questions, parentNumber) => {
  return (
    <ul className="space-y-2">
      {questions.map((question, index) => {
        const currentNumber = parentNumber
          ? `${parentNumber}.${index + 1}` // Child question (e.g., "1.1", "1.1.1")
          : `${index + 1}`; // Root question (e.g., "1", "2")

        return (
          <li key={question.id} className={`ml-${parentNumber ? parentNumber.split('.').length * 4 : 0} text-left`}>
            <div className="pl-4 border-l-2 border-gray-300">
              <strong>{currentNumber}.</strong> {question.text}
              {question.children.length > 0 && renderQuestions(question.children, currentNumber)} {/* Recursive call */}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default FormSubmissionView;
