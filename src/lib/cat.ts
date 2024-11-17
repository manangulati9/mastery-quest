import { z } from "zod";

// Types and types for CAT implementation
export const TestItemSchema = z.object({
  id: z.string(),
  difficulty: z.number(),
  discrimination: z.number(),
  contentArea: z.string(),
  question: z.string(),
  options: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    }),
  ),
  correctAnswer: z.string(),
});

export type TestItem = z.infer<typeof TestItemSchema>;

type TestResponse = {
  itemId: string;
  response: string | number;
  isCorrect: boolean;
};

export type TestState = {
  itemBank: TestItem[];
  administeredItems?: TestItem[];
  responses?: TestResponse[];
  currentAbility?: number;
};

export class ComputerAdaptiveTest {
  private itemBank: TestItem[];
  private responses: TestResponse[];
  private currentAbility: number;

  private administeredItems: TestItem[];

  constructor(props: TestState) {
    if (props.itemBank.length === 0) {
      throw new Error("Item bank cannot be empty.");
    }
    this.itemBank = props.itemBank;
    this.administeredItems = props.administeredItems || [];
    this.responses = props.responses || [];
    this.currentAbility = props.currentAbility || 0;
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
        return sum + this.getDiscrimination(diff) * (r - probCorrect[index]);
      }, 0);

      // Calculate second derivative
      const denominator = difficulties.reduce((sum, diff, index) => {
        const p = probCorrect[index];
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
   * Returns item discrimination parameter (simplified model)
   */
  private getDiscrimination(difficulty: number): number {
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
    const INITIAL_DIFFICULTY = -1;

    if (this.administeredItems.length === 0) {
      const item = this.itemBank.find(
        (i) => i.difficulty === INITIAL_DIFFICULTY,
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
        const p = this.getProbability(this.currentAbility, [
          item.difficulty,
        ])[0];
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
    nextItem && this.administeredItems.push(nextItem);
    return nextItem;
  }

  /**
   * Processes a student's response to a test item & update ability estimate
   */
  public processResponse(itemId: string, response: string | number) {
    const item = this.administeredItems.find((i) => i.id === itemId);
    if (!item) throw new Error("Item not found");

    // Update responses
    const isCorrect = response === item.correctAnswer;
    this.responses.push({ itemId, response, isCorrect });

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
    };
  }
}
