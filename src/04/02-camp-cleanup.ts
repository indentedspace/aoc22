import { getRanges } from "./01-camp-cleanup";

getRanges().then((pairs) => {
  const isOverlappingPair = pairs.map(([firstElf, secondElf]) => {
    if (firstElf[0] >= secondElf[0] && firstElf[0] <= secondElf[1]) return true;
    if (firstElf[1] >= secondElf[0] && firstElf[1] <= secondElf[1]) return true;
    if (secondElf[0] >= firstElf[0] && secondElf[0] <= firstElf[1]) return true;
    if (secondElf[1] >= firstElf[0] && secondElf[1] <= firstElf[1]) return true;

    return false;
  });

  // console.log(
  //   "got overlapping pairs",
  //   pairs.map((item, index) => ({
  //     pair: item.toString(),
  //     overlap: isOverlappingPair[index],
  //   }))
  // );

  console.log(
    "the total number of overlapping pairs is:",
    isOverlappingPair.filter((pair) => pair).length
  );
});
