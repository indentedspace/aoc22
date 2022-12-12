import { getInstructions } from "./01-crt";

getInstructions().then((instructions) => {
  const width = 40;
  const height = 6;

  let screen = new Array(height).fill(0).map(() => {
    return new Array(width).fill(".");
  });

  let x = 1;
  let processing = false;
  let instructionAddress = 0;

  for (let i = 0; instructionAddress < instructions.length; i++) {
    const [instruction, value] = instructions[instructionAddress];

    const row = Math.floor(i / width);
    const column = i % width;
    const spriteExistsOnCurrentPixel = Math.abs(column - x) <= 1;

    if (spriteExistsOnCurrentPixel) {
      console.log("sprite exists", x, row, column, screen[row][column]);
      screen[row][column] = "#";
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

  console.log("screen");
  console.log(screen.map((row) => row.join("")).join("\n"));
});
