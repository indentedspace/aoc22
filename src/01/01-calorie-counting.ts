import path from "node:path";
import { getDataFromLocation } from "../file";

const dataLocation = `../../data/01/01-calorie-counting.txt`;

const getData = async () => {
  const data = await getDataFromLocation(path.join(__dirname, dataLocation));
  return data;
};

export const getSortedElves = async () => {
  const data = await getData();
  const lines = data.split("\n");
  const elves = lines
    .reduce<string[][]>(
      (accumulator, currentValue) => {
        if (!currentValue.length) return [...accumulator, []];

        let newAccumulator = [...accumulator];
        newAccumulator[newAccumulator.length - 1] = [
          ...newAccumulator[newAccumulator.length - 1],
          currentValue,
        ];

        return newAccumulator;
      },
      [[]]
    )
    .reduce<number[]>((accumulator, currentValue) => {
      const totalCalories = currentValue
        .map((elem) => parseInt(elem))
        .reduce<number>((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0);

      return [...accumulator, totalCalories];
    }, []);

  const sortedElves = elves.sort((a, b) => a - b);

  return sortedElves;
};

getSortedElves().then((sortedElves) => {
  const heaviestElf = sortedElves[sortedElves.length - 1];

  console.log("heaviest elf is carrying", heaviestElf, "calories");
});
