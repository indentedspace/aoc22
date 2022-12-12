import path from "node:path";
import { getDataFromLocation } from "../file";

const dataLocation = `../../data/09/09-rope-bridge.txt`;

const getData = async () => {
  const data = await getDataFromLocation(path.join(__dirname, dataLocation));
  return data;
};

export const getDirections = async () => {
  const data = await getData();
  const directions: [string, number][] = data
    .split("\n")
    .map((elem) => elem.split(" "))
    .map((elem) => [elem[0], parseInt(elem[1])]);

  return directions;
};

getDirections().then((directions) => {
  let head = { x: 0, y: 0 };
  let tail = { x: 0, y: 0 };
  let locations: string[] = ["0, 0"];

  const moveHead = (direction: string) => {
    switch (direction) {
      case "U":
        head.y++;
        break;
      case "D":
        head.y--;
        break;
      case "L":
        head.x--;
        break;
      case "R":
        head.x++;
        break;
      default:
        console.log("unknown direction", direction);
        break;
    }

    moveTail();
  };

  const moveTail = () => {
    const xDiff = head.x - tail.x;
    const yDiff = head.y - tail.y;

    const isAdjacent = Math.abs(xDiff) <= 1 && Math.abs(yDiff) <= 1;

    if (isAdjacent) {
      // console.log("no move required", head, tail);
      return;
    }

    const xMoveRequired = Math.abs(xDiff) === 2;
    const yMoveRequired = Math.abs(yDiff) === 2;
    const diagonalMoveRequired = !(head.x === tail.x || head.y === tail.y);

    if (diagonalMoveRequired) {
      // console.log("diagonal move required", head, tail);
      xDiff > 0 ? tail.x++ : tail.x--;
      yDiff > 0 ? tail.y++ : tail.y--;
    } else if (xMoveRequired) {
      // console.log("x move required", head, tail);
      xDiff > 0 ? tail.x++ : tail.x--;
    } else if (yMoveRequired) {
      // console.log("y move required", head, tail);
      yDiff > 0 ? tail.y++ : tail.y--;
    }

    logTailMove();
  };

  const logTailMove = () => {
    locations = Array.from(new Set([...locations, `${tail.x}, ${tail.y}`]));
  };

  // console.log("starting to move rope");

  for (const [direction, steps] of directions) {
    // console.log("moving head", direction, "for", steps, "steps");
    for (let i = 0; i < steps; i++) {
      moveHead(direction);
    }
    // console.log("tail locations visited is now", locations.length);
  }

  console.log(
    "finished moving rope, tail visited",
    locations.length,
    "unique locations"
  );
});
