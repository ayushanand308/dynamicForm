import React from 'react';

const AddQuestionButton = ({ onClick, isChild = false }) => {
  return (
    <div className="mt-4 sm:mt-6">
      <button
        type="button"
        onClick={onClick}
        className="w-full bg-blue-500 text-white py-3 px-5 rounded-lg font-semibold hover:bg-blue-600 transition-all"
      >
        {isChild ? 'Add Child Question' : 'Add New Question'}
      </button>
    </div>
  );
};

export default AddQuestionButton;
