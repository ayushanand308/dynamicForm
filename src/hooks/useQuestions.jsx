import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';


const useQuestions = () => {

  const [questions, setQuestions] = useState(() => {
    const savedQuestions = localStorage.getItem('questions');
    return savedQuestions ? JSON.parse(savedQuestions) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify(questions));
  }, [questions]);

  const generateId = () => uuidv4();

  const autoNumberQuestions = useCallback((questions, parentNumber = '') => {
    if (!Array.isArray(questions)) return [];
    
    return questions.map((question, index) => {
      const newNumber = parentNumber ? `${parentNumber}.${index + 1}` : `Q${index + 1}`;
      const updatedChildren = question.children ? autoNumberQuestions(question.children, newNumber) : [];
      return { ...question, number: newNumber, children: updatedChildren };
    });
  }, []);

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
        const updatedQuestions = [...prevQuestions, newQuestion];
        return autoNumberQuestions(updatedQuestions);
      } else {
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