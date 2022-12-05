import path from "node:path";
import { getDataFromLocation } from "../file";

const dataLocation = `../../data/05/05-supply-stacks.txt`;

const getData = async () => {
  const data = await getDataFromLocation(path.join(__dirname, dataLocation));
  return data;
};

export const parseData = async () => {
  const data = await getData();
  const lines = data.split("\n");
  const blankElement = lines.indexOf("");

  const unparsedCrates = lines.slice(0, blankElement);
  const unparsedInstructions = lines.slice(blankElement + 1);

  const rows = unparsedCrates
    .slice(0, -1)
    .map((elem) => Array.from(elem).filter((item, index) => index % 4 === 1));

  const stacks = rows
    .reverse()
    .reduce<string[][]>((accumulator, currentRow) => {
      let newAccumulator = accumulator.length
        ? [...accumulator]
        : [...new Array(currentRow.length).fill([])];

      currentRow.forEach((item, index) => {
        if (/^[A-Z]$/.test(item))
          newAccumulator[index] = [...newAccumulator[index], item];
      });

      return newAccumulator;
    }, []);

  const instructions = unparsedInstructions.map((line) => {
    const match = /^move (\d+) from (\d+) to (\d+)$/.exec(line);

    if (!match) throw new Error(`no match for line ${line}`);

    return match.slice(1).map((elem) => parseInt(elem));
  });

  return { stacks, instructions };
};

parseData().then(({ stacks, instructions }) => {
  const finalPosition = instructions.reduce((accumulator, [move, from, to]) => {
    let newAccumulator = [...accumulator];
    const fromIndex = from - 1;
    const toIndex = to - 1;
    const chunk = newAccumulator[fromIndex].slice(-move);

    newAccumulator[fromIndex] = newAccumulator[fromIndex].slice(0, -move);
    newAccumulator[toIndex] = [...newAccumulator[toIndex], ...chunk.reverse()];

    return newAccumulator;
  }, stacks);

  const topCrates = finalPosition.map((stack) => stack[stack.length - 1]);

  console.log(
    "the final position of the crates looks like this:",
    finalPosition
  );
  console.log("the top crates give the message:", topCrates.join(""));
});
