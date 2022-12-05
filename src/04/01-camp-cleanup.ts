import path from "node:path";
import { getDataFromLocation } from "../file";

const dataLocation = `../../data/04/04-camp-cleanup.txt`;

export const getData = async () => {
  const data = await getDataFromLocation(path.join(__dirname, dataLocation));
  return data;
};

export const getRanges = async () => {
  const data = await getData();

  const pairs = data
    .split("\n")
    .map((line) =>
      line
        .split(",")
        .map((pair) => pair.split("-").map((elem) => parseInt(elem)))
    );

  return pairs;
};

const checkFullyContainedPairs = async () => {
  const pairs = await getRanges();

  const isFullyContained = pairs.map(([firstElf, secondElf]) => {
    if (firstElf[0] >= secondElf[0] && firstElf[1] <= secondElf[1]) return true;
    if (secondElf[0] >= firstElf[0] && secondElf[1] <= firstElf[1]) return true;
  });

  const fullyContainedAmount = isFullyContained.filter((elem) => elem).length;

  console.log("the amount of fully contained pairs is:", fullyContainedAmount);
};

checkFullyContainedPairs();
