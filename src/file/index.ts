import { readFile } from "node:fs/promises";

export const getDataFromLocation = async (dataLocation: string) => {
  const data = await readFile(dataLocation);

  return data.toString();
};
