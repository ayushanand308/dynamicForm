import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Question from './Question';
import AddQuestionButton from './AddQuestionButton';
import FormSubmissionView from './FormSubmissionView';
import useQuestions from '../hooks/useQuestions';

const DynamicForm = () => {
  const { questions, addQuestion, deleteQuestion, updateQuestion, reorderQuestions } = useQuestions();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    reorderQuestions(startIndex, endIndex);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10 bg-gradient-to-br from-blue-100 via-white to-blue-50 shadow-xl rounded-lg mt-10">
      {!isSubmitted ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
              Create Your Questions
            </h2>

            <Droppable droppableId="questions-list">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                  {questions.map((question, index) => (
                    <Draggable key={question.id} draggableId={question.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-white p-5 rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl"
                        >
                          <Question
                            question={question}
                            addQuestion={addQuestion}
                            deleteQuestion={deleteQuestion}
                            updateQuestion={updateQuestion}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <AddQuestionButton onClick={() => addQuestion(null)} />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-5 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
            >
              Submit Form
            </button>
          </form>
        </DragDropContext>
      ) : (
        <div className="mt-10">
          <FormSubmissionView questions={questions} />
          <button
            onClick={handleReset}
            className="w-full bg-green-500 text-white py-3 px-5 rounded-lg mt-5 font-semibold hover:bg-green-600 transition-all"
          >
            Reset Form
          </button>
        </div>
      )}
    </div>
  );
};

export default DynamicForm;
