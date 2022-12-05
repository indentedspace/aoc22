import { getData, priority } from "./01-rucksack-reorganization";

const getElfGroups = async () => {
  const data = await getData();

  const lines = data.split("\n");

  let elfGroups: string[][] = [];
  const groupSize = 3;

  lines.forEach((item, index) => {
    const groupIndex = Math.floor(index / groupSize);
    const group = elfGroups[groupIndex] || [];
    elfGroups[groupIndex] = [...group, item];
  });

  return elfGroups;
};

getElfGroups().then((elfGroups) => {
  const badges = elfGroups.map((elfGroup) => {
    const arrays = elfGroup
      .sort((a, b) => a.length - b.length)
      .map((elf) => Array.from(new Set(elf)));

    const firstElf = arrays[0];
    const otherElves = arrays.slice(1);

    const badge = firstElf.reduce<string>((accumulator, currentValue) => {
      if (accumulator.length) return accumulator;

      const isBadge = otherElves.every((elf) => {
        return elf.indexOf(currentValue) !== -1;
      });

      return isBadge ? currentValue : accumulator;
    }, "");

    return badge;
  });

  const priorities = badges.map((badge) => priority.indexOf(badge) + 1);

  const sumOfPriorities = priorities.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  // console.log(
  //   "got badges for elf groups",
  //   elfGroups.map((group, index) => ({
  //     group,
  //     badge: badges[index],
  //     priority: priorities[index],
  //   }))
  // );

  console.log("sum of badge priorities is:", sumOfPriorities);
});
