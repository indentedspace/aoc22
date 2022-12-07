import { getData } from "./01-tuning-trouble";

getData().then((data) => {
  let indexOfMarker = 0;

  const stringArray = Array.from(data);

  for (let i = 14; i < stringArray.length; i++) {
    const lastFourCharacters = stringArray.slice(i - 14, i);
    const uniqueOfLastFour = Array.from(new Set(lastFourCharacters));

    if (uniqueOfLastFour.length === 14) {
      indexOfMarker = i;
      break;
    }
  }

  console.log("first start of message marker after character:", indexOfMarker);
});
