import {
  type WeightedItem,
  WeightedItemFeeder,
} from "../../../common/weightedItemFeeder.js";
import type { StaticCommand } from "../../type.js";

export const shogun: StaticCommand = {
  name: "shogun",
  run: () => {
    return shogunFeeder.getItem() ?? "NO_DATA";
  },
};

const data: WeightedItem<string>[] = [
  {
    content: "徳川家康",
    weight: 2 * 12 + 2,
  },
  {
    content: "徳川秀忠",
    weight: 18 * 12 + 3,
  },
  {
    content: "徳川家光",
    weight: 27 * 12 + 9,
  },
  {
    content: "徳川家綱",
    weight: 28 * 12 + 9,
  },
  {
    content: "徳川綱吉",
    weight: 28 * 12 + 5,
  },
  {
    content: "徳川家宣",
    weight: 3 * 12 + 5,
  },
  {
    content: "徳川家継",
    weight: 3 * 12 + 1,
  },
  {
    content: "徳川吉宗",
    weight: 29 * 12 + 1,
  },
  {
    content: "徳川家重",
    weight: 14 * 12 + 6,
  },
  {
    content: "徳川家治",
    weight: 26 * 12 + 4,
  },
  {
    content: "徳川家斉",
    weight: 50 * 12,
  },
  {
    content: "徳川家慶",
    weight: 16 * 12 + 2,
  },
  {
    content: "徳川家定",
    weight: 4 * 12 + 8,
  },
  {
    content: "徳川家茂",
    weight: 7 * 12 + 9,
  },
  {
    content: "徳川慶喜",
    weight: 12,
  },
];

const shogunFeeder = new WeightedItemFeeder(...data);
