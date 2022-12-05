import path from "node:path";
import { getDataFromLocation } from "../file";

const dataLocation = `../../data/03/03-rucksack-reorganization.txt`;

export const priority = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export const getData = async () => {
  const data = await getDataFromLocation(path.join(__dirname, dataLocation));
  return data;
};

const getSharedProperties = async () => {
  const data = await getData();

  const rucksacks = data.split("\n");
  const compartments = rucksacks.map((rucksack) => [
    rucksack.slice(0, rucksack.length / 2),
    rucksack.slice(rucksack.length / 2),
  ]);

  const commonPropertiesOfCompartments = compartments.map(
    ([firstCompartment, secondCompartment]) => {
      const firstUnique: string[] = Array.from(new Set(firstCompartment));
      const secondUnique: string[] = Array.from(new Set(secondCompartment));

      const commonProperty = firstUnique.reduce<string>(
        (accumulator, currentValue) => {
          if (!accumulator.length || secondUnique.includes(currentValue))
            return currentValue;

          return accumulator;
        },
        ""
      );

      return commonProperty;
    }
  );

  const priorities = commonPropertiesOfCompartments.map(
    (property) => priority.indexOf(property) + 1
  );

  // console.log(
  //   "got common properties of compartments",
  //   rucksacks.map((item, index) => {
  //     return {
  //       rucksack: item,
  //       compartments: compartments[index],
  //       commonProperty: commonPropertiesOfCompartments[index],
  //       priority: priorities[index],
  //     };
  //   })
  // );

  const sumOfPriorities = priorities.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  console.log(
    "the sum of priorities for the reorganized rucksacks are:",
    sumOfPriorities
  );
};

getSharedProperties();
