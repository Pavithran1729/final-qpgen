import { QuestionFromDB, TopicQuestion } from "@/types/question";

export const selectRandomQuestions = (
  availableQuestions: QuestionFromDB[],
  requirements: TopicQuestion[]
): QuestionFromDB[] => {
  const selectedQuestions: QuestionFromDB[] = [];
  const usedQuestions = new Set<string>();

  for (const requirement of requirements) {
    // First try to find questions that match both main and OR criteria
    const matchingQuestions = availableQuestions.filter(q => {
      if (usedQuestions.has(q.id)) return false;

      // Check main requirements
      const mainMatches = 
        q.part === requirement.part &&
        q.marks.toString() === requirement.marks &&
        q.k_level === requirement.kLevel &&
        q.co_level === requirement.coLevel;

      // If this is not an OR question, just check main requirements
      if (requirement.hasOr !== "true") {
        return mainMatches;
      }

      // For OR questions, we need two matching questions
      // First, find questions that match the main criteria
      if (mainMatches) {
        // Look for another question that matches OR criteria
        const orMatches = availableQuestions.some(orQ => {
          if (orQ.id === q.id || usedQuestions.has(orQ.id)) return false;

          return orQ.part === (requirement.orPart || requirement.part) &&
                 orQ.marks.toString() === (requirement.orMarks || requirement.marks) &&
                 orQ.k_level === (requirement.orKLevel || requirement.kLevel) &&
                 orQ.co_level === (requirement.orCoLevel || requirement.coLevel);
        });

        return orMatches;
      }

      // Also check if this question could be an OR question for a main question
      const couldBeOrQuestion = 
        q.part === (requirement.orPart || requirement.part) &&
        q.marks.toString() === (requirement.orMarks || requirement.marks) &&
        q.k_level === (requirement.orKLevel || requirement.kLevel) &&
        q.co_level === (requirement.orCoLevel || requirement.coLevel);

      if (couldBeOrQuestion) {
        // Look for another question that matches main criteria
        return availableQuestions.some(mainQ => {
          if (mainQ.id === q.id || usedQuestions.has(mainQ.id)) return false;

          return mainQ.part === requirement.part &&
                 mainQ.marks.toString() === requirement.marks &&
                 mainQ.k_level === requirement.kLevel &&
                 mainQ.co_level === requirement.coLevel;
        });
      }

      return false;
    });

    if (matchingQuestions.length > 0) {
      // Select a random question from matching ones
      const selectedIndex = Math.floor(Math.random() * matchingQuestions.length);
      const selectedQuestion = matchingQuestions[selectedIndex];
      
      // For OR questions, also select a matching OR question
      if (requirement.hasOr === "true") {
        // Find all potential OR questions
        const orQuestions = availableQuestions.filter(q => {
          if (q.id === selectedQuestion.id || usedQuestions.has(q.id)) return false;

          return q.part === (requirement.orPart || requirement.part) &&
                 q.marks.toString() === (requirement.orMarks || requirement.marks) &&
                 q.k_level === (requirement.orKLevel || requirement.kLevel) &&
                 q.co_level === (requirement.orCoLevel || requirement.coLevel);
        });

        if (orQuestions.length > 0) {
          // Select a random OR question
          const orIndex = Math.floor(Math.random() * orQuestions.length);
          const orQuestion = orQuestions[orIndex];
          
          // Mark both questions as used
          usedQuestions.add(selectedQuestion.id);
          usedQuestions.add(orQuestion.id);
          
          // Add both questions
          selectedQuestions.push({
            ...selectedQuestion,
            has_or: true,
            or_content: orQuestion.content,
            or_marks: orQuestion.marks,
            or_k_level: orQuestion.k_level,
            or_part: orQuestion.part,
            or_co_level: orQuestion.co_level
          });
        }
      } else {
        // For non-OR questions, just add the selected question
        usedQuestions.add(selectedQuestion.id);
        selectedQuestions.push(selectedQuestion);
      }
    }
  }

  return selectedQuestions;
};