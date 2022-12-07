import path from "node:path";
import { getDataFromLocation } from "../file";

const dataLocation = `../../data/06/06-tuning-trouble.txt`;

export const getData = async () => {
  const data = await getDataFromLocation(path.join(__dirname, dataLocation));
  return data;
};

getData().then((data) => {
  let indexOfMarker = 0;

  const stringArray = Array.from(data);

  for (let i = 4; i < stringArray.length; i++) {
    const lastFourCharacters = stringArray.slice(i - 4, i);
    const uniqueOfLastFour = Array.from(new Set(lastFourCharacters));

    if (uniqueOfLastFour.length === 4) {
      indexOfMarker = i;
      break;
    }
  }

  console.log(
    "first start of packet marker after character:",
    indexOfMarker,
    data.length,
    data.slice(indexOfMarker - 20, indexOfMarker + 20)
  );
});
