import { parseData } from "./01-supply-stacks";

parseData().then(({ stacks, instructions }) => {
  const finalPosition = instructions.reduce((accumulator, [move, from, to]) => {
    let newAccumulator = [...accumulator];
    const fromIndex = from - 1;
    const toIndex = to - 1;
    const chunk = newAccumulator[fromIndex].slice(-move);

    newAccumulator[fromIndex] = newAccumulator[fromIndex].slice(0, -move);
    newAccumulator[toIndex] = [...newAccumulator[toIndex], ...chunk];

    return newAccumulator;
  }, stacks);

  const topCrates = finalPosition.map((stack) => stack[stack.length - 1]);

  console.log(
    "the actual final position of the crates looks like this:",
    finalPosition
  );
  console.log("the actual top crates give the message:", topCrates.join(""));
});
