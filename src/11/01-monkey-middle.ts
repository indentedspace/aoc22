import path from "node:path";
import { getDataFromLocation } from "../file";

const dataLocation = `../../data/11/11-monkey-middle.txt`;

export const getData = async () => {
  const data = await getDataFromLocation(path.join(__dirname, dataLocation));
  return data;
};

interface Monkey {
  items: number[];
  operation: (value: number) => number;
  test: (value: number) => number;
}

const getMonkeys = async () => {
  const data = await getData();

  const chunks = data.split("\n\n");
  const monkeys: Monkey[] = chunks.map((chunk) => {
    const lines = chunk.split("\n");

    let monkey: Monkey = {
      items: [],
      operation: (value) => value,
      test: (value) => -1,
    };

    const startingItemsRegEx = /^\s*Starting items: ([\d, ]*)$/;
    const startingItemsMatch = startingItemsRegEx.exec(lines[1]);

    if (startingItemsMatch)
      monkey.items = startingItemsMatch[1]
        .replace(/\s/g, "")
        .split(",")
        .map((elem) => parseInt(elem));

    const operationRegEx = /^\s*Operation: (.*)$/;
    const operationMatch = operationRegEx.exec(lines[2]);

    if (operationMatch) {
      const operation = operationMatch[1].split(" ");
      const addition = operation[3] === "+";
      const multiplication = operation[3] === "*";
      const number =
        operation[4] === "old" ? operation[4] : parseInt(operation[4]);

      monkey.operation = (value) => {
        console.log("Monkey inspects an item with a worry level of", value);
        const actualNumber = number === "old" ? value : number;

        if (addition)
          console.log(
            "Worry level increases by",
            actualNumber,
            "to",
            value + actualNumber
          );
        if (multiplication)
          console.log(
            "Worry level multiplied by",
            actualNumber,
            "to",
            value * actualNumber
          );

        return addition
          ? value + actualNumber
          : multiplication
          ? value * actualNumber
          : value;
      };
    }

    const testRegEx = /^\s*Test: divisible by (\d*)$/;
    const testMatch = testRegEx.exec(lines[3]);
    const resultRegEx = /^\s*If (?:true|false): throw to monkey (\d*)$/;
    const trueMatch = resultRegEx.exec(lines[4]);
    const falseMatch = resultRegEx.exec(lines[5]);

    if (testMatch && trueMatch && falseMatch) {
      const testValue = parseInt(testMatch[1]);
      const trueValue = parseInt(trueMatch[1]);
      const falseValue = parseInt(falseMatch[1]);

      monkey.test = (value) => {
        const isDivisible = value % testValue === 0;
        console.log(
          "Current worry level",
          isDivisible ? "is" : "is not",
          "divisible by",
          testValue
        );
        console.log(
          "Item with worry level",
          value,
          "is thrown to monkey",
          isDivisible ? trueValue : falseValue
        );
        return value > 0 && isDivisible ? trueValue : falseValue;
      };
    }

    return monkey;
  });

  return monkeys;
};

// getMonkeys().then((initialMonkeys) => {
//   let monkeys = [...initialMonkeys];

//   const doTurn = (monkey: number) => {
//     const { items, operation, test } = monkeys[monkey];
//     // console.log("Monkey", monkey);

//     items.forEach((item) => {
//       const inspection = operation(item);
//       const worry = Math.floor(inspection / 3);
//       // console.log(
//       //   "Monkey gets bored with item. Worry level is divided by 3 to",
//       //   worry
//       // );
//       const receivingMonkey = test(worry);
//       monkeys[receivingMonkey].items.push(worry);
//     });

//     monkeys[monkey].items = [];

//     return items.length;
//   };

//   const doRound = () => monkeys.map((m, index) => doTurn(index));

//   const rounds = 20;

//   const results = new Array(rounds).fill(0).reduce<number[]>((accumulator) => {
//     const round = doRound();
//     const newAccumulator = round.map((value, index) => {
//       const prevValue = accumulator[index] || 0;

//       return prevValue + value;
//     });

//     return newAccumulator;
//   }, []);

//   const highestValues = results.sort((a, b) => b - a).slice(0, 2);

//   const monkeyBusiness = highestValues[0] * highestValues[1];

//   console.log(
//     "got results from",
//     rounds,
//     "rounds",
//     results.map(
//       (result, index) => `Monkey ${index} inspected items ${result} times.`
//     ),
//     "highest values",
//     highestValues,
//     "monkey business",
//     monkeyBusiness
//   );
// });
