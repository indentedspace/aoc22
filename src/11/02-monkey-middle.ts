import { getData } from "./01-monkey-middle";
import primes from "./primes.json";

interface BigNumber {
  base: number;
  multiplier: number;
  remainder?: number;
}

interface Monkey {
  items: number[];
  operation: (value: number, commonDenominator: number) => number;
  test: (value: number) => number;
  divisor: number;
}

const primeNumbers = primes;
const aBigNumber = 1.0e100;

const adjustBase = (number: BigNumber, factor: number): BigNumber => {
  const newBase = number.base / factor;
  const remainder = number.remainder || 0;
  const extraMultiplier = Math.floor(remainder / newBase);
  const remainingRemainder = remainder - extraMultiplier * newBase;
  const newMultiplier = number.multiplier * factor + extraMultiplier;

  const newNumber = {
    base: newBase,
    multiplier: newMultiplier,
    remainder: number.remainder ? remainingRemainder : undefined,
  };

  console.log("adjusting base from", number, "to", newNumber);

  if (!isFinite(newNumber.multiplier)) {
    console.log("but multiplier is infinite so returning original number");
    return number;
  }

  return newNumber;
};

const adjustMultiplier = (number: BigNumber, factor: number): BigNumber => {
  const newBase = number.base * factor;
  const newMultiplier = number.multiplier / factor;
  const remainder = number.remainder || 0;
  const extraMultiplier = Math.floor(remainder / newBase);
  const remainingRemainder = remainder - extraMultiplier * newBase;

  const newNumber = {
    base: newBase,
    multiplier: newMultiplier + extraMultiplier,
    remainder: number.remainder ? remainingRemainder : undefined,
  };

  console.log("adjusting multiplier from", number, "to", newNumber);

  if (!isFinite(newNumber.base)) {
    console.log("but base is infinite so returning original number");
    return number;
  }

  return newNumber;
};

const washNumber = (number: BigNumber): BigNumber => {
  let { base, multiplier, remainder } = number;

  if (!isFinite(multiplier))
    throw new Error("washing multiplier is infinite lol");

  if (remainder) {
    const remainderIntoBase = Math.floor(remainder / base);

    if (remainderIntoBase >= 1) {
      multiplier += remainderIntoBase;
      remainder = remainder % base;
    }
  }

  for (const prime of primeNumbers) {
    const baseIsBig = base > aBigNumber;
    if (baseIsBig && base > prime && base % prime === 0)
      return adjustBase({ base, multiplier, remainder }, prime);
    if (multiplier > prime && multiplier % prime === 0)
      return adjustMultiplier({ base, multiplier, remainder }, prime);
  }

  console.log("can't wash this number any further", {
    base,
    multiplier,
    remainder,
  });
  return { base, multiplier, remainder };
};

const getMonkeys = async () => {
  const data = await getData();

  const chunks = data.split("\n\n");
  const monkeys: Monkey[] = chunks.map((chunk) => {
    const lines = chunk.split("\n");

    let monkey: Monkey = {
      items: [],
      operation: (value) => value,
      test: (value) => -1,
      divisor: -1,
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
      const square = number === "old";

      monkey.operation = (value, commonDenominator) => {
        let newValue = value;

        if (addition && typeof number === "number") newValue += number;
        if (multiplication && typeof number === "number") newValue *= number;
        if (square) newValue = newValue ** 2;

        newValue = newValue % commonDenominator;

        return newValue;
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

      monkey.divisor = testValue;

      monkey.test = (value) => {
        const isDivisible = value % testValue === 0;

        // console.log(
        //   "Current worry level",
        //   isDivisible ? "is" : "is not",
        //   "divisible by",
        //   testValue
        // );
        // console.log(
        //   "Item with worry level",
        //   value,
        //   "is thrown to monkey",
        //   isDivisible ? trueValue : falseValue
        // );
        return isDivisible ? trueValue : falseValue;
      };
    }

    return monkey;
  });

  return monkeys;
};

getMonkeys().then((initialMonkeys) => {
  const commonDenominator = initialMonkeys.reduce(
    (a, { divisor }) => a * divisor,
    1
  );

  let monkeys = [...initialMonkeys];

  const doTurn = (monkey: number) => {
    const { items, operation, test } = monkeys[monkey];
    // console.log("Monkey", monkey);

    items.forEach((item) => {
      const inspection = operation(item, commonDenominator);
      const worry = inspection;
      // console.log(
      //   "Monkey gets bored with item. Worry level is divided by 3 to",
      //   worry
      // );
      const receivingMonkey = test(worry);
      monkeys[receivingMonkey].items.push(worry);
    });

    monkeys[monkey].items = [];

    return items.length;
  };

  const doRound = () => monkeys.map((m, index) => doTurn(index));

  const doOneHundredRounds = () =>
    new Array(100).fill(0).reduce<number[]>((accumulator) => {
      const round = doRound();
      const newAccumulator = round.map((value, index) => {
        const prevValue = accumulator[index] || 0;

        return prevValue + value;
      });

      return newAccumulator;
    }, []);

  const doOneThousandRounds = () =>
    new Array(10).fill(0).reduce<number[]>((accumulator) => {
      const rounds = doOneHundredRounds();
      const newAccumulator = rounds.map((value, index) => {
        const prevValue = accumulator[index] || 0;

        return prevValue + value;
      });

      return newAccumulator;
    }, []);

  const rounds = 10000;

  const results = new Array(rounds / 1000)
    .fill(0)
    .reduce<number[]>((accumulator) => {
      const rounds = doOneThousandRounds();
      const newAccumulator = rounds.map((value, index) => {
        const prevValue = accumulator[index] || 0;

        return prevValue + value;
      });

      return newAccumulator;
    }, []);

  const highestValues = results.sort((a, b) => b - a).slice(0, 2);

  const monkeyBusiness = highestValues[0] * highestValues[1];

  console.log(
    "got results from",
    rounds,
    "rounds",
    results.map(
      (result, index) => `Monkey ${index} inspected items ${result} times.`
    ),
    "highest values",
    highestValues,
    "monkey business",
    monkeyBusiness
  );
});
