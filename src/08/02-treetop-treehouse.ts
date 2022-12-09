import { getTrees } from "./01-treetop-treehouse";

getTrees().then((trees) => {
  const highestScenicScore = trees.reduce(
    (accumulator, currentValue, index) => {
      if (index === 0 || index === trees.length - 1) return accumulator;

      const rowHighestScore = currentValue.reduce((a, currentTree, i) => {
        if (i === 0 || i === currentValue.length - 1) return a;

        let up = 0;
        let right = 0;
        let down = 0;
        let left = 0;

        for (let j = index - 1; j >= 0; j--) {
          const targetTree = trees[j][i];

          up++;

          if (targetTree.height >= currentTree.height) break;
        }

        for (let j = index + 1; j < trees.length; j++) {
          const targetTree = trees[j][i];

          down++;

          if (targetTree.height >= currentTree.height) break;
        }

        for (let j = i - 1; j >= 0; j--) {
          const targetTree = currentValue[j];

          left++;

          if (targetTree.height >= currentTree.height) break;
        }

        for (let j = i + 1; j < currentValue.length; j++) {
          const targetTree = currentValue[j];

          right++;

          if (targetTree.height >= currentTree.height) break;
        }

        const total = up * down * left * right;

        return total > a ? total : a;
      }, 0);

      console.log("most scenic tree in row", index, "is", rowHighestScore);

      return rowHighestScore > accumulator ? rowHighestScore : accumulator;
    },
    0
  );

  console.log("most scenic tree overall is", highestScenicScore);
});
