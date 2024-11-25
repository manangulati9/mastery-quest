import { describe, it, expect, beforeEach } from "vitest";
import { ComputerAdaptiveTest, type TestItem, type TestState } from "./cat";

describe("ComputerAdaptiveTest", () => {
  let mockItemBank: TestItem[];
  let initialTestState: TestState;

  beforeEach(() => {
    // Setup mock item bank with varying difficulties
    mockItemBank = [
      {
        id: 1,
        difficulty: -2,
        discrimination: 1,
        subject: "math",
        question: "What is 2+2?",
        options: ["3", "4", "5", "6"],
        answer: "4",
      },
      {
        id: 2,
        difficulty: -1,
        discrimination: 1,
        subject: "math",
        question: "What is 5+5?",
        options: ["8", "9", "10", "11"],
        answer: "10",
      },
      {
        id: 3,
        difficulty: 0,
        discrimination: 1,
        subject: "math",
        question: "What is 12×12?",
        options: ["144", "124", "164", "146"],
        answer: "144",
      },
      {
        id: 4,
        difficulty: 1,
        discrimination: 1,
        subject: "math",
        question: "What is the square root of 144?",
        options: ["10", "11", "12", "13"],
        answer: "12",
      },
      {
        id: 5,
        difficulty: 2,
        discrimination: 1,
        subject: "math",
        question: "Solve for x: 2x + 5 = 21",
        options: ["6", "7", "8", "9"],
        answer: "8",
      },
    ];

    initialTestState = {
      itemBank: mockItemBank,
      score: 0,
      administeredItems: [],
      responses: [],
      currentAbility: 0,
    };
  });

  describe("initialization", () => {
    it("should initialize with valid test state", () => {
      const cat = new ComputerAdaptiveTest(initialTestState);
      expect(cat.getState()).toEqual(initialTestState);
    });

    it("should throw error when initialized with empty item bank", () => {
      const emptyState = { ...initialTestState, itemBank: [] };
      expect(() => new ComputerAdaptiveTest(emptyState)).toThrow(
        "Item bank cannot be empty",
      );
    });
  });

  describe("getNextQuestion", () => {
    it("should select first question with lower difficulty for new test", () => {
      const cat = new ComputerAdaptiveTest(initialTestState);
      const firstQuestion = cat.getNextQuestion();

      expect(firstQuestion).not.toBeNull();
      expect(firstQuestion?.difficulty).toBeLessThanOrEqual(0);
    });

    it("should not return previously administered questions", () => {
      const cat = new ComputerAdaptiveTest(initialTestState);

      // Get first question
      const question1 = cat.getNextQuestion();
      expect(question1).not.toBeNull();

      // Process response to trigger ability update
      if (question1) {
        cat.processResponse(question1.id, question1.answer);
      }

      // Get second question
      const question2 = cat.getNextQuestion();
      expect(question2).not.toBeNull();
      expect(question2?.id).not.toBe(question1?.id);
    });

    it("should return null when all questions have been administered", () => {
      const cat = new ComputerAdaptiveTest(initialTestState);

      // Administer all questions
      for (const _ of mockItemBank) {
        const question = cat.getNextQuestion();
        if (question) {
          cat.processResponse(question.id, question.answer);
        }
      }

      // Try to get one more question
      const noMoreQuestions = cat.getNextQuestion();
      expect(noMoreQuestions).toBeNull();
    });
  });

  describe("processResponse", () => {
    it("should correctly process correct answer", () => {
      const cat = new ComputerAdaptiveTest(initialTestState);
      const question = cat.getNextQuestion();

      if (question) {
        cat.processResponse(question.id, question.answer);
        const state = cat.getState();

        expect(state.score).toBe(1);
        expect(state.responses).toHaveLength(1);
        expect(state.responses[0]).toEqual({
          questionId: question.id,
          response: question.answer,
          isCorrect: true,
        });
      }
    });

    it("should correctly process incorrect answer", () => {
      const cat = new ComputerAdaptiveTest(initialTestState);
      const question = cat.getNextQuestion();

      if (question) {
        const wrongAnswer =
          question.options.find((opt) => opt !== question.answer) || "";
        cat.processResponse(question.id, wrongAnswer);
        const state = cat.getState();

        expect(state.score).toBe(0);
        expect(state.responses).toHaveLength(1);
        expect(state.responses[0]).toEqual({
          questionId: question.id,
          response: wrongAnswer,
          isCorrect: false,
        });
      }
    });

    it("should throw error for invalid question id", () => {
      const cat = new ComputerAdaptiveTest(initialTestState);
      expect(() => cat.processResponse(999, "any answer")).toThrow(
        "Item not found",
      );
    });
  });

  describe("ability estimation", () => {
    it("should increase ability estimate after correct answers", () => {
      const cat = new ComputerAdaptiveTest(initialTestState);
      const initialAbility = cat.getState().currentAbility;

      // Answer first question correctly
      const question = cat.getNextQuestion();
      if (question) {
        cat.processResponse(question.id, question.answer);
      }

      const newAbility = cat.getState().currentAbility;
      expect(newAbility).toBeGreaterThan(initialAbility);
    });

    it("should decrease ability estimate after incorrect answers", () => {
      const cat = new ComputerAdaptiveTest(initialTestState);
      const initialAbility = cat.getState().currentAbility;

      // Answer first question incorrectly
      const question = cat.getNextQuestion();
      if (question) {
        const wrongAnswer =
          question.options.find((opt) => opt !== question.answer) || "";
        cat.processResponse(question.id, wrongAnswer);
      }

      const newAbility = cat.getState().currentAbility;
      expect(newAbility).toBeLessThan(initialAbility);
    });

    it("should bound ability estimate between -3 and 3", () => {
      const cat = new ComputerAdaptiveTest(initialTestState);

      // Answer multiple questions incorrectly to push ability down
      for (let i = 0; i < 10; i++) {
        const question = cat.getNextQuestion();
        if (question) {
          const wrongAnswer =
            question.options.find((opt) => opt !== question.answer) || "";
          cat.processResponse(question.id, wrongAnswer);
        }
      }

      const finalAbility = cat.getState().currentAbility;
      expect(finalAbility).toBeGreaterThanOrEqual(-3);
      expect(finalAbility).toBeLessThanOrEqual(3);
    });
  });
});
