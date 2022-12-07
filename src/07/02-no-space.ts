import {
  generateDirectory,
  calculateDirectorySize,
  getDirectorySizes,
} from "./01-no-space";

const totalDiskSpace = 70000000;
const freeSpaceRequired = 30000000;

generateDirectory().then((directory) => {
  const currentDiskUsed = calculateDirectorySize(directory);
  const currentFreeSpace = totalDiskSpace - currentDiskUsed;
  const additionalFreeSpaceRequired = freeSpaceRequired - currentFreeSpace;

  console.log(
    `disk usage: ${currentDiskUsed}/${totalDiskSpace}, free space: ${currentFreeSpace}/${freeSpaceRequired}, ${additionalFreeSpaceRequired} required`
  );

  const sizes = getDirectorySizes(directory, []).sort((a, b) => a - b);
  const validSizes = sizes.filter(
    (number) => number >= additionalFreeSpaceRequired
  );

  console.log(
    `valid folders: ${validSizes.length}/${sizes.length}`,
    `smallest is:`,
    validSizes[0]
  );
});
