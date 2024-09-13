import { useState, useCallback } from 'react';

const useQuestions = () => {
  // State to store all questions
  const [questions, setQuestions] = useState([]);

  // Helper function to generate a unique ID for each question
  const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

  // Function to recursively assign numbers to questions based on their hierarchy
  const autoNumberQuestions = useCallback((questions, parentNumber = '') => {
    if (!Array.isArray(questions)) return []; // Guard clause
    
    return questions.map((question, index) => {
      const newNumber = parentNumber ? `${parentNumber}.${index + 1}` : `Q${index + 1}`;
      const updatedChildren = question.children ? autoNumberQuestions(question.children, newNumber) : [];
      return { ...question, number: newNumber, children: updatedChildren };
    });
  }, []);

  // Function to add a new question
  const addQuestion = useCallback((parentId = null) => {
    setQuestions((prevQuestions) => {
      const newQuestion = {
        id: generateId(),
        text: '',
        type: 'Short Answer',
        parentId,
        children: [],
        number: '',
      };

      if (!parentId) {
        // Add new parent question
        const updatedQuestions = [...prevQuestions, newQuestion];
        return autoNumberQuestions(updatedQuestions);
      } else {
        // Add child question
        const updatedQuestions = prevQuestions.map((question) => {
          if (question.id === parentId) {
            return {
              ...question,
              children: [...question.children, newQuestion],
            };
          } else if (question.children.length) {
            return {
              ...question,
              children: addNestedChild(question.children, parentId, newQuestion),
            };
          }
          return question;
        });
        return autoNumberQuestions(updatedQuestions);
      }
    });
  }, [autoNumberQuestions]);

  // Recursive helper to add a child to the correct parent
  const addNestedChild = (questions, parentId, newQuestion) => {
    return questions.map((question) => {
      if (question.id === parentId) {
        return {
          ...question,
          children: [...question.children, newQuestion],
        };
      }
      if (question.children.length) {
        return {
          ...question,
          children: addNestedChild(question.children, parentId, newQuestion),
        };
      }
      return question;
    });
  };

  // Function to update a specific question in the state
  const updateQuestion = useCallback((id, updates) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((question) =>
        question.id === id
          ? { ...question, ...updates }
          : {
              ...question,
              children: updateNestedQuestion(question.children, id, updates),
            }
      );
      return autoNumberQuestions(updatedQuestions);
    });
  }, [autoNumberQuestions]);

  // Recursive helper to update a nested question
  const updateNestedQuestion = (questions, id, updates) => {
    return questions.map((question) => {
      if (question.id === id) {
        return { ...question, ...updates };
      }
      if (question.children.length) {
        return {
          ...question,
          children: updateNestedQuestion(question.children, id, updates),
        };
      }
      return question;
    });
  };

  // Function to delete a question and its children from the state
  const deleteQuestion = useCallback((id) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.filter((question) => question.id !== id);
      const filteredQuestions = updatedQuestions.map((question) => {
        if (question.children.length) {
          return {
            ...question,
            children: filterNestedQuestions(question.children, id),
          };
        }
        return question;
      });
      return autoNumberQuestions(filteredQuestions);
    });
  }, [autoNumberQuestions]);

  // Recursive helper to delete nested questions
  const filterNestedQuestions = (questions, id) => {
    return questions
      .filter((question) => question.id !== id)
      .map((question) => {
        return {
          ...question,
          children: filterNestedQuestions(question.children, id),
        };
      });
  };

  const reorderQuestions = useCallback((startIndex, endIndex) => {
    setQuestions((prevQuestions) => {
      const result = Array.from(prevQuestions);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return autoNumberQuestions(result);
    });
  }, []);

  // Return the state and functions
  return {
    questions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    autoNumberQuestions,
    reorderQuestions,
  };
};

export default useQuestions;