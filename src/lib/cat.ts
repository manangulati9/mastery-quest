import { z } from "zod";

// Types and types for CAT implementation
export const TestItemSchema = z.object({
  id: z.number(),
  difficulty: z.coerce.number(),
  discrimination: z.coerce.number(),
  subject: z.string(),
  question: z.string(),
  options: z.array(z.string()),
  answer: z.string(),
});

export type TestItem = z.infer<typeof TestItemSchema>;

export const ResponseSchema = z.object({
  questionId: z.number(),
  response: z.string(),
  isCorrect: z.boolean(),
});

export type Response = z.infer<typeof ResponseSchema>;

export const TestStateSchema = z.object({
  itemBank: z.array(z.custom<TestItem>()),
  score: z.number().default(0),
  administeredItems: z.array(z.custom<TestItem>()).default([]),
  responses: z.array(z.custom<Response>()).default([]),
  currentAbility: z.number().default(0),
});

export type TestState = z.infer<typeof TestStateSchema>;

export class ComputerAdaptiveTest {
  private itemBank: TestItem[];
  private responses: Response[];
  private currentAbility: number;
  private administeredItems: TestItem[];
  private score: number;

  constructor(props: TestState) {
    if (props.itemBank.length === 0) {
      throw new Error("Item bank cannot be empty.");
    }
    this.itemBank = props.itemBank;
    this.administeredItems = props.administeredItems;
    this.responses = props.responses;
    this.currentAbility = props.currentAbility;
    this.score = props.score;
  }

  /**
   * Estimates student's ability using Maximum Likelihood Estimation (MLE)
   */
  private estimateAbility(difficulties: number[]): number {
    let theta = 0; // Initial ability estimate
    const maxIterations = 20;

    for (let i = 0; i < maxIterations; i++) {
      const probCorrect = this.getProbability(theta, difficulties);

      // Calculate first derivative
      const numerator = difficulties.reduce((sum, diff, index) => {
        const r = this.responses.at(index)?.isCorrect ? 1 : 0;
        const p = probCorrect[index] ?? 0; //TODO: Verify this equation later
        return sum + this.getDiscrimination(diff) * (r - p);
      }, 0);

      // Calculate second derivative
      const denominator = difficulties.reduce((sum, diff, index) => {
        const p = probCorrect[index] ?? 0; //TODO: Verify this equation later
        return sum + -(this.getDiscrimination(diff) ** 2) * p * (1 - p);
      }, 0);

      if (denominator === 0) break;

      const delta = numerator / denominator;
      theta -= delta;

      if (Math.abs(delta) < 0.001) break;
    }

    // Bound theta between -3 and 3
    return Math.min(Math.max(theta, -3), 3);
  }

  /**
   * Returns item discrimination parameter (simplified model) (arg: difficulty)
   */
  private getDiscrimination(_: number): number {
    return 1.0;
  }

  /**
   * Calculates probability of correct response using 2PL IRT model
   */
  private getProbability(theta: number, difficulties: number[]): number[] {
    return difficulties.map(
      (d) => 1 / (1 + Math.exp(-this.getDiscrimination(d) * (theta - d))),
    );
  }

  /**
   * Selects the next best item based on maximum information
   */
  private selectNextItem(): TestItem | null {
    let maxInfo = Number.NEGATIVE_INFINITY;
    let bestItem: TestItem | null = null;
    const INITIAL_DIFFICULTY = Number((Math.random() * -3).toFixed(2));

    if (this.administeredItems.length === 0) {
      const item = this.itemBank.find(
        (i) => i.difficulty === Math.ceil(INITIAL_DIFFICULTY),
      );

      if (!item) {
        // console.log("Unable to fetch first question item");
        return null;
      }

      return item;
    }

    const administeredIds = this.administeredItems.map((item) => item.id);

    for (const item of this.itemBank) {
      if (!administeredIds.includes(item.id)) {
        // Calculate item information at current ability
        const p =
          this.getProbability(this.currentAbility, [item.difficulty])[0] ?? 0; //TODO: Verify this equation later;
        const info = this.getDiscrimination(item.difficulty) ** 2 * p * (1 - p);

        if (info > maxInfo) {
          maxInfo = info;
          bestItem = item;
        }
      }
    }

    if (!bestItem) {
      console.log("Unable to fetch bestItem");
      return null;
    }

    return bestItem;
  }

  /**
   * Selects next item from the item bank
   */
  public getNextQuestion(): TestItem | null {
    const nextItem = this.selectNextItem();
    if (nextItem) {
      this.administeredItems.push(nextItem);
    }
    return nextItem;
  }

  /**
   * Processes a student's response to a test item & update ability estimate
   */
  public processResponse(questionId: number, response: string) {
    const item = this.administeredItems.find((i) => i.id === questionId);
    if (!item) throw new Error("Item not found");

    // Update responses
    const isCorrect = response === item.answer;
    isCorrect && this.score++;
    this.responses.push({ questionId, response, isCorrect });

    // Update ability estimate
    const difficulties = this.administeredItems.map((item) => item.difficulty);
    this.currentAbility = this.estimateAbility(difficulties);
  }

  public getState(): TestState {
    return {
      itemBank: this.itemBank,
      administeredItems: this.administeredItems,
      responses: this.responses,
      currentAbility: this.currentAbility,
      score: this.score,
    };
  }
}
