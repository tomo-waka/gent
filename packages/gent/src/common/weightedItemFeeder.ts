import { faker } from "@faker-js/faker";

export interface WeightedItem<Item> {
  readonly content: Item;
  readonly weight?: number;
}

interface NormalizedWeightedItem<Item> extends WeightedItem<Item> {
  readonly weight: number;
}

const DEFAULT_WEIGHT = 1;
const MIN_WEIGHT = 0;
const MAX_WEIGHT = 2 ** 16;

export class WeightedItemFeeder<Item> {
  private totalWeight: number = -1;
  private normalizedWeightedItems: NormalizedWeightedItem<Item>[];

  constructor(...weightedItems: WeightedItem<Item>[]) {
    this.normalizedWeightedItems = weightedItems.map<
      NormalizedWeightedItem<Item>
    >(normalizeWeightedItem);
    this.updateTotalWeight();
  }

  public get size(): number {
    return this.normalizedWeightedItems.length;
  }

  public addItem(item: Item, weight: number = DEFAULT_WEIGHT): void {
    const weightedItem: NormalizedWeightedItem<Item> = {
      content: item,
      weight: weight,
    };
    this.addWeightedItem(weightedItem);
  }

  public addWeightedItem(weightedItem: WeightedItem<Item>): void {
    this.normalizedWeightedItems.push(normalizeWeightedItem(weightedItem));
    this.updateTotalWeight();
  }

  public getItem(): Item | undefined {
    const totalWeight = this.totalWeight;
    if (totalWeight < MIN_WEIGHT) {
      return undefined;
    }
    const targetAccumWeight = faker.number.float({
      min: MIN_WEIGHT,
      max: totalWeight,
    });
    let accumWeight = MIN_WEIGHT;
    const weightedItem = this.normalizedWeightedItems.find(({ weight }) => {
      accumWeight = accumWeight + weight;
      if (targetAccumWeight <= accumWeight) {
        return true;
      }
      return false;
    });
    return weightedItem?.content;
  }

  private updateTotalWeight(): void {
    this.totalWeight = this.normalizedWeightedItems.reduce(
      (sum, { weight }) => {
        return sum + weight;
      },
      0,
    );
  }
}

function normalizeWeightedItem<Item>(
  weightedItem: WeightedItem<Item>,
): NormalizedWeightedItem<Item> {
  let weight: number;
  if (typeof weightedItem.weight === "number") {
    weight = weightedItem.weight;
  } else {
    weight = DEFAULT_WEIGHT;
  }
  return {
    content: weightedItem.content,
    weight: normalizeWeight(weight),
  };
}

export function normalizeWeight(value: number): number {
  return Math.min(Math.max(value, MIN_WEIGHT), MAX_WEIGHT);
}
