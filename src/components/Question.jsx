import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';

const Question = ({ question, addQuestion, deleteQuestion, updateQuestion, dragHandleProps }) => {
  const [answer, setAnswer] = useState('');

  const handleQuestionChange = (e) => {
    updateQuestion(question.id, { text: e.target.value });
  };

  const handleTypeChange = (e) => {
    updateQuestion(question.id, { type: e.target.value });
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
    if (e.target.value === 'False') {
      updateQuestion(question.id, { children: [] });
    }
  };

  return (
    <div
      className={`p-5 bg-white rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 ${question.depth > 0 ? 'ml-5 border-l-4 border-indigo-500' : ''}`}
    >
      <div className="mr-2 cursor-move text-gray-600" {...dragHandleProps}>
        <GripVertical size={24} />
      </div>
      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
          <input
            type="text"
            value={question.text}
            onChange={handleQuestionChange}
            placeholder="Enter question"
            className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <select
            value={question.type}
            onChange={handleTypeChange}
            className="p-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="Short Answer">Short Answer</option>
            <option value="True/False">True/False</option>
          </select>

          <button
            onClick={() => deleteQuestion(question.id)}
            className="text-red-500 hover:text-red-600 font-semibold transition-colors duration-200"
          >
            Delete
          </button>
        </div>

        {question.type === 'True/False' && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <label className="text-gray-700">
              Answer:
              <select
                value={answer}
                onChange={handleAnswerChange}
                className="ml-2 p-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">-- Select --</option>
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            </label>
          </div>
        )}

        {question.type === 'True/False' && answer === 'True' && (
          <button
          onClick={(e) => {
            e.preventDefault();
            addQuestion(question.id);
          }}
            className="mt-3 text-indigo-500 hover:text-indigo-600 transition-colors duration-200"
          >
            Add Nested Child Question
          </button>
        )}

        {question.children.length > 0 && (
          <div className="mt-4 space-y-4">
            {question.children.map((childQuestion) => (
              <Question
                key={childQuestion.id}
                question={childQuestion}
                addQuestion={addQuestion}
                deleteQuestion={deleteQuestion}
                updateQuestion={updateQuestion}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Question;
