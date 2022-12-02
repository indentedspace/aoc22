import path from "node:path";
import { getDataFromLocation } from "../file";

const dataLocation = `../../data/02/02-rock-paper-scissors.txt`;

export type OpponentHand = "A" | "B" | "C";
type MyHand = "X" | "Y" | "Z";

export type Hand = "rock" | "paper" | "scissors";

export const getData = async () => {
  const data = await getDataFromLocation(path.join(__dirname, dataLocation));
  return data;
};

export const getTypeFromCode = (code: OpponentHand | MyHand): Hand => {
  const rocks = ["A", "X"];
  const papers = ["B", "Y"];
  const scissors = ["C", "Z"];

  if (rocks.includes(code)) return "rock";
  if (papers.includes(code)) return "paper";
  if (scissors.includes(code)) return "scissors";

  throw new Error("failed to find type from code");
};

export const getPointsFromVictory = (theirHand: Hand, myHand: Hand) => {
  if (theirHand === "rock" && myHand === "paper") return 6;
  if (theirHand === "paper" && myHand === "scissors") return 6;
  if (theirHand === "scissors" && myHand === "rock") return 6;

  if (theirHand === "rock" && myHand === "rock") return 3;
  if (theirHand === "paper" && myHand === "paper") return 3;
  if (theirHand === "scissors" && myHand === "scissors") return 3;

  return 0;
};

export const getPointsFromShape = (myHand: Hand) => {
  if (myHand === "rock") return 1;
  else if (myHand === "paper") return 2;
  else if (myHand === "scissors") return 3;
  else return 0;
};

const getPointsFromRound = (opponent: OpponentHand, me: MyHand) => {
  const shapePoints = getPointsFromShape(getTypeFromCode(me));
  const victoryPoints = getPointsFromVictory(
    getTypeFromCode(opponent),
    getTypeFromCode(me)
  );

  return shapePoints + victoryPoints;
};

const getStrategy = async () => {
  const data = await getData();
  const strategy = data
    .split("\n")
    .map((elem) => elem.split(" ") as [OpponentHand, MyHand]);

  return strategy;
};

getStrategy().then((strategy) => {
  const rounds = strategy.map(([opponent, me]) =>
    getPointsFromRound(opponent, me)
  );
  const points = rounds.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  console.log("played", rounds.length, "rounds", rounds);
  console.log("total score", points, "points");
});
