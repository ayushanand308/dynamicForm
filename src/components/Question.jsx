import React, { useState } from 'react';
import { GripVertical, ChevronRight, ChevronDown } from 'lucide-react';

const Question = ({ question, addQuestion, deleteQuestion, updateQuestion, dragHandleProps }) => {
  const [answer, setAnswer] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl ${question.depth > 0 ? 'ml-4 mt-4' : 'mb-4'}`}>
      <div className="p-4 flex items-start space-x-4">
        <div className="flex items-center space-x-2">
          {question.children.length > 0 && (
            <button onClick={toggleExpand} className="text-gray-500 hover:text-gray-700">
              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
          )}
          <div className="cursor-move text-gray-600" {...dragHandleProps}>
            <GripVertical size={20} />
          </div>
        </div>
        <div className="flex-grow space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              value={question.text}
              onChange={handleQuestionChange}
              placeholder="Enter question"
              className="flex-grow p-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 min-w-0"
            />
            <div className="flex items-center space-x-2">
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
          </div>

          {question.type === 'True/False' && (
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 flex items-center">
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
              {answer === 'True' && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addQuestion(question.id);
                  }}
                  className="text-indigo-500 hover:text-indigo-600 transition-colors duration-200"
                >
                  Add Nested Child Question
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {isExpanded && question.children.length > 0 && (
        <div className="pl-8 pr-4 pb-4 space-y-4 border-l-2 border-indigo-200">
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
  );
};

export default Question;