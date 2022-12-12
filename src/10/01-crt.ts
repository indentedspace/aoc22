import path from "node:path";
import { getDataFromLocation } from "../file";

const dataLocation = `../../data/10/10-crt.txt`;

const getData = async () => {
  const data = await getDataFromLocation(path.join(__dirname, dataLocation));
  return data;
};

const maxCycles = 220;

export const getInstructions = async () => {
  const data = await getData();
  const instructions: [string, number][] = data
    .split("\n")
    .map((elem) => elem.split(" "))
    .map((elem) => [elem[0], parseInt(elem[1] || "0")]);
  return instructions;
};

getInstructions().then((instructions) => {
  let instructionAddress = 0;
  let x = 1;
  let processing = false;
  let signalStrengths: number[] = [];

  for (let i = 1; i <= maxCycles; i++) {
    const [instruction, value] = instructions[instructionAddress];

    // console.log(
    //   "cycle",
    //   i,
    //   "x:",
    //   x,
    //   "instruction:",
    //   instructions[instructionAddress],
    //   instruction,
    //   value
    // );

    if (i % 20 === 0) {
      const strength = x * i;
      console.log("cycle", i, "signal strength", strength);
      signalStrengths.push(strength);
    }

    switch (instruction) {
      case "addx":
        if (processing) {
          x += value;
          instructionAddress++;
        }
        processing = !processing;
        break;
      case "noop":
        instructionAddress++;
        break;
      default:
        console.log("unknown operation", instruction);
        break;
    }
  }

  console.log(
    "signal strengths:",
    signalStrengths.filter((v, i) => i % 2 === 0),
    "with a sum of:",
    signalStrengths.filter((v, i) => i % 2 === 0).reduce((a, c) => a + c, 0)
  );
});
