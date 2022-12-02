import { getSortedElves } from "./01-calorie-counting";

getSortedElves().then((sortedElves) => {
  const topThreeElves = sortedElves.slice(-3);

  const combinedWeight = topThreeElves.reduce<number>(
    (accumulator, currentValue) => {
      return accumulator + currentValue;
    },
    0
  );

  console.log(
    "the three heaviest elves are",
    topThreeElves,
    "and their combined weight is",
    combinedWeight
  );
});
