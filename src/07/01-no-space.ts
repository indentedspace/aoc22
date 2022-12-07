import path from "node:path";
import { getDataFromLocation } from "../file";

const dataLocation = `../../data/07/07-no-space.txt`;

const getData = async () => {
  const data = await getDataFromLocation(path.join(__dirname, dataLocation));
  return data;
};

interface Directory {
  [key: string]: Directory | number;
}

const updateDirectoryValue = (
  directory: Directory,
  cwd: string[],
  value: Directory | number
): Directory => {
  const childDirectoryName = cwd[0];
  // console.log("adding", value, "to", cwd.join("/"));
  if (cwd.length === 1) {
    // if a directory, and directory already exists, don't replace it
    if (typeof value !== "number" && !!directory[childDirectoryName])
      return directory;

    if (typeof value === "number") {
      // console.log("added file", childDirectoryName, value);
    } else {
      // console.log("created directory", childDirectoryName);
    }

    return { ...directory, [childDirectoryName]: value };
  } else {
    // this directory doesn't handle the update, so send it to child directory
    const childDirectory = directory[childDirectoryName];

    if (typeof childDirectory === "number")
      throw new Error(
        `this is a file but it should be a directory: ${childDirectoryName} ${childDirectory}`
      );

    const updatedChildDirectory = updateDirectoryValue(
      childDirectory,
      cwd.slice(1),
      value
    );

    return { ...directory, [childDirectoryName]: updatedChildDirectory };
  }
};

export const getDirectorySizes = (
  directory: Directory,
  cwd: string[]
): number[] => {
  const sizes = Object.entries(directory)
    .filter((elem) => typeof elem !== "number")
    .sort(([aName], [bName]) => {
      return aName === bName ? 0 : aName > bName ? 1 : -1;
    })
    .map(([name, value]) => {
      if (typeof value !== "number") {
        const validSubdirectorySizes = getDirectorySizes(value, [...cwd, name]);
        return validSubdirectorySizes;
      } else return [];
    })
    .reduce(
      (accumulator, currentValue) => [...accumulator, ...currentValue],
      []
    );

  const currentSize = calculateDirectorySize(directory);
  return [...sizes, currentSize];
};

export const calculateDirectorySize = (directory: Directory): number => {
  const values = Object.values(directory);

  const sizes = values.map((value) => {
    if (typeof value === "number") return value;
    else return calculateDirectorySize(value);
  });

  return sizes.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
};

export const generateDirectory = async () => {
  const data = await getData();
  const lines = data.split("\n");

  const { directory } = lines.reduce<{ cwd: string[]; directory: Directory }>(
    (accumulator, currentValue) => {
      // console.log("processing line:", currentValue);
      let { cwd, directory } = { ...accumulator } as {
        cwd: string[];
        directory: Directory;
      };

      const lsRegEx = /^\$ ls/;
      const cdRegEx = /^\$ cd (.+)$/;
      const outputRegEx = /^([^\$ ]{2}.*?) (.+)$/;

      if (lsRegEx.test(currentValue)) return accumulator;

      if (cdRegEx.test(currentValue)) {
        const match = cdRegEx.exec(currentValue);

        if (match) {
          const intendedDirectory = match[1];

          cwd =
            intendedDirectory === "/"
              ? [""]
              : intendedDirectory === ".."
              ? cwd.slice(0, -1)
              : [...cwd, intendedDirectory];

          // console.log("cd", intendedDirectory, cwd);

          return { cwd, directory };
        }
      }

      if (outputRegEx.test(currentValue)) {
        const match = outputRegEx.exec(currentValue);

        if (match) {
          const size = match[1];
          const name = match[2];

          directory = updateDirectoryValue(
            directory,
            [...cwd, name],
            size === "dir" ? {} : parseInt(size)
          );

          return { cwd, directory };
        }
      }

      console.log("no idea what the fuck happened here chief", currentValue);
      return accumulator;
    },
    { cwd: [""], directory: { "": {} } }
  );

  return directory;
};

generateDirectory().then((directory) => {
  const logAllFiles = (directory: Directory, level = 0) => {
    Object.entries(directory)
      .sort(([aName, aValue], [bName, bValue]) => {
        if (typeof aValue === "number" && typeof bValue !== "number") return 1;
        if (typeof bValue === "number" && typeof aValue !== "number") return -1;

        return aName === bName ? 0 : aName > bName ? 1 : -1;
      })
      .forEach(([name, value]) => {
        if (typeof value !== "number") {
          console.log(`${"".padStart(2 * level, " ")}- ${name}/`);
          logAllFiles(value, level + 1);
        } else {
          console.log(
            `${"".padStart(2 * level, " ")}- ${value
              .toString()
              .padStart(8, " ")} - ${name}`
          );
        }
      });
  };

  const logDirectorySizes = (directory: Directory, cwd: string[]) => {
    Object.entries(directory)
      .filter((elem) => typeof elem !== "number")
      .sort(([aName], [bName]) => {
        return aName === bName ? 0 : aName > bName ? 1 : -1;
      })
      .forEach(([name, value]) => {
        if (typeof value !== "number") {
          console.log(`${"".padStart(2 * cwd.length, " ")}- ${name}/`);
          logDirectorySizes(value, [...cwd, name]);
        }
      });

    const directorySize = calculateDirectorySize(directory);

    console.log(
      `${"".padStart(2 * cwd.length, " ")}Total Size: ${directorySize
        .toString()
        .padStart(8, " ")}`
    );
  };

  const maxFileSize = 100000;
  const getValidDirectorySizes = (directory: Directory): number[] => {
    const sizes = getDirectorySizes(directory, []).filter(
      (size) => size <= maxFileSize
    );

    return sizes;
  };

  // console.log("logging directory sizes");
  // logDirectorySizes(directory, []);
  // console.log("getting valid sizes");
  const validSizes = getValidDirectorySizes(directory);
  const sumOfValidSizes = validSizes.reduce((a, c) => a + c, 0);
  console.log("sum of valid sizes is:", sumOfValidSizes);
});
