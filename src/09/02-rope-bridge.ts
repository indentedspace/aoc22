import { getDirections } from "./01-rope-bridge";

getDirections().then((directions) => {
  const ropeLength = 10;
  let rope = new Array(ropeLength).fill(0).map(() => ({ x: 0, y: 0 }));
  let locations: string[] = ["0, 0"];

  const moveHead = (direction: string) => {
    let head = rope[0];
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
    rope[0] = head;

    moveTail();
  };

  const moveTail = (index = 1) => {
    let previousSegment = rope[index - 1];
    let thisSegment = rope[index];

    const xDiff = previousSegment.x - thisSegment.x;
    const yDiff = previousSegment.y - thisSegment.y;

    const isAdjacent = Math.abs(xDiff) <= 1 && Math.abs(yDiff) <= 1;

    if (isAdjacent) {
      // console.log("no move required", previousSegment, thisSegment);
      return;
    }

    const xMoveRequired = Math.abs(xDiff) === 2;
    const yMoveRequired = Math.abs(yDiff) === 2;
    const diagonalMoveRequired = !(
      previousSegment.x === thisSegment.x || previousSegment.y === thisSegment.y
    );

    if (diagonalMoveRequired) {
      // console.log("diagonal move required", previousSegment, thisSegment);
      xDiff > 0 ? thisSegment.x++ : thisSegment.x--;
      yDiff > 0 ? thisSegment.y++ : thisSegment.y--;
    } else if (xMoveRequired) {
      // console.log("x move required", previousSegment, thisSegment);
      xDiff > 0 ? thisSegment.x++ : thisSegment.x--;
    } else if (yMoveRequired) {
      // console.log("y move required", previousSegment, thisSegment);
      yDiff > 0 ? thisSegment.y++ : thisSegment.y--;
    }

    rope[index] = thisSegment;

    if (index + 1 === ropeLength) logTailMove(thisSegment);
    else moveTail(index + 1);
  };

  const logTailMove = ({ x, y }: { x: number; y: number }) => {
    locations = Array.from(new Set([...locations, `${x}, ${y}`]));
  };

  console.log("starting to move rope");

  for (const [direction, steps] of directions) {
    console.log("moving head", direction, "for", steps, "steps");
    for (let i = 0; i < steps; i++) {
      moveHead(direction);
    }
    console.log("tail locations visited is now", locations.length);
  }

  console.log(
    "finished moving rope, tail visited",
    locations.length,
    "unique locations"
  );
});
