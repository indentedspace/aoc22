import {
  getData,
  OpponentHand,
  Hand,
  getTypeFromCode,
  getPointsFromVictory,
  getPointsFromShape,
} from "./01-rock-paper-scissors";

type HandOutcome = "lose" | "draw" | "win";
type EncryptedOutcome = "X" | "Y" | "Z";

const getOutcomeFromCode = (code: EncryptedOutcome): HandOutcome => {
  if (code === "X") return "lose";
  else if (code === "Y") return "draw";
  else return "win";
};

const getNeededHandFromOutcome = (
  opponent: OpponentHand,
  outcome: HandOutcome
): Hand => {
  const opponentHand = getTypeFromCode(opponent);

  if (outcome === "draw") {
    if (opponentHand === "rock") return "rock";
    if (opponentHand === "paper") return "paper";
    if (opponentHand === "scissors") return "scissors";
  } else if (outcome === "lose") {
    if (opponentHand === "rock") return "scissors";
    if (opponentHand === "paper") return "rock";
    if (opponentHand === "scissors") return "paper";
  } else {
    if (opponentHand === "rock") return "paper";
    if (opponentHand === "paper") return "scissors";
    if (opponentHand === "scissors") return "rock";
  }

  throw new Error("unable to determine needed hand");
};

const getStrategy = async () => {
  const data = await getData();

  const strategy = data
    .split("\n")
    .map((elem) => elem.split(" ") as [OpponentHand, EncryptedOutcome]);

  return strategy;
};

getStrategy().then((strategy) => {
  const points = strategy.map(([opponent, code]) => {
    const desiredOutcome = getOutcomeFromCode(code);
    const neededHand = getNeededHandFromOutcome(opponent, desiredOutcome);
    const victoryPoints = getPointsFromVictory(
      getTypeFromCode(opponent),
      neededHand
    );
    const shapePoints = getPointsFromShape(neededHand);

    return victoryPoints + shapePoints;
  });

  const totalPoints = points.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  console.log(
    "applied correct strategy for a total score of",
    totalPoints,
    "points"
  );
});
