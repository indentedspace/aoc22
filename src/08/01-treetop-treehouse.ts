import path from "node:path";
import { getDataFromLocation } from "../file";

const dataLocation = `../../data/08/08-treetop-treehouse.txt`;

const getData = async () => {
  const data = await getDataFromLocation(path.join(__dirname, dataLocation));
  return data;
};

interface Tree {
  height: number;
  visible?: boolean;
}

export const getTrees = async () => {
  const data = await getData();
  const rows = data
    .split("\n")
    .map((line) => Array.from(line))
    .map((row) => row.map((char) => parseInt(char)))
    .map((row) => row.map((height) => ({ height } as Tree)));

  return rows;
};

const getVisibleTrees = (trees: Tree[][]) => {
  // all edge trees are visible. that means the entire first and last row,
  // and the first and last elements of each other row
  const newTrees = [...trees];
  const visibleEdges = newTrees.map((row, index) => {
    if (index === 0 || index === newTrees.length - 1)
      return row.map((tree) => ({ ...tree, visible: true }));
    else
      return row.map((tree, index) =>
        index === 0 || index === row.length - 1
          ? { ...tree, visible: true }
          : tree
      );
  });

  // for each row, check left and right
  // if every tree in that direction < currentTree, it is visible
  // else it is not visible in that direction

  const visibleHorizontally = visibleEdges.map((row, index) => {
    if (index === 0 || index === visibleEdges.length - 1) return row;

    const sortedRow = [...row].sort((a, b) => b.height - a.height);
    const tallestTree = sortedRow[0];

    let newRow: Tree[] = [...row];

    for (let i = 1; i < newRow.length - 1; i++) {
      const isTallest = newRow[i] === tallestTree;

      if (isTallest) newRow[i] = { ...newRow[i], visible: true };

      let isTallerLeft = true;

      for (let j = 0; j < i; j++) {
        if (newRow[j].height >= newRow[i].height) {
          isTallerLeft = false;
          break;
        }
      }

      if (isTallerLeft) newRow[i] = { ...newRow[i], visible: true };

      let isTallerRight = true;

      for (let j = newRow.length - 1; j > i; j--) {
        if (newRow[j].height >= newRow[i].height) {
          isTallerRight = false;
        }
      }

      if (isTallerRight) newRow[i] = { ...newRow[i], visible: true };
    }

    return newRow;
  });

  const columns = new Array(visibleHorizontally.length)
    .fill(0)
    .map((i, index) => {
      return visibleHorizontally.map((row) => row[index]);
    });

  const visibleVertically = columns.map((row, index) => {
    if (index === 0 || index === visibleEdges.length - 1) return row;

    const sortedRow = [...row].sort((a, b) => b.height - a.height);
    const tallestTree = sortedRow[0];

    let newRow = [...row];

    for (let i = 1; i < newRow.length - 1; i++) {
      const isTallest = newRow[i] === tallestTree;

      if (isTallest) newRow[i] = { ...newRow[i], visible: true };

      let isTallerUp = true;

      for (let j = 0; j < i; j++) {
        if (newRow[j].height >= newRow[i].height) {
          isTallerUp = false;
          break;
        }
      }

      if (isTallerUp) newRow[i] = { ...newRow[i], visible: true };

      let isTallerDown = true;

      for (let j = newRow.length - 1; j > i; j--) {
        if (newRow[j].height >= newRow[i].height) {
          isTallerDown = false;
        }
      }

      if (isTallerDown) newRow[i] = { ...newRow[i], visible: true };
    }

    return newRow;
  });

  const visibleRows = new Array(visibleVertically.length)
    .fill(0)
    .map((i, index) => {
      return visibleVertically.map((row) => row[index]);
    });

  console.log("visible trees");
  visibleRows.forEach((row) => {
    const string = row
      .map(({ visible, height }) => (visible === true ? height : " "))
      .join("");
    console.log("|", string, "|");
  });

  const totalVisibleTrees = visibleRows.reduce((accumulator, currentValue) => {
    const thisRow = currentValue.reduce(
      (a, { visible }) => (visible === true ? a + 1 : a),
      0
    );
    return accumulator + thisRow;
  }, 0);

  console.log("total visible trees from outside the grid:", totalVisibleTrees);
};

getTrees().then((trees) => getVisibleTrees(trees));
