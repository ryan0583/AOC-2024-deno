import path from 'node:path';
import { readLines } from '../../fileParser';
import { log } from '../../logger';
import { sum } from '../../arrays';

const lines = readLines(path.resolve(), 'solutions/7/input.txt');

const equations = lines.map((line) => ({
  result: Number(line.split(': ')[0]),
  inputVals: line.split(': ')[1].split(' ').map(Number).reverse(),
}));

const operators = ['+', '*'];

const filteredEquations = equations.filter(({ result, inputVals }) => {
  const results = inputVals.reduce<number[]>(
    (acc, val, index) => {
      return operators
        .flatMap((operator) =>
          acc.map((num) => (operator === '+' ? num - val : num / val))
        )
        .filter((num) => Number.isInteger(num) && num >= 0);
    },
    [result]
  );
  return results.filter((result) => result === 0).length > 0;
});

log(sum(filteredEquations.map(({ result }) => result)));

const pt2operators = ['+', '||', '*'];

const filteredEquationsPt2 = equations.filter(({ result, inputVals }) => {
  const results = inputVals.reduce<number[]>(
    (acc, val) => {
      return pt2operators
        .flatMap((operator) =>
          acc.map((num) => {
            if (operator === '+') return num - val;
            if (operator === '*') return num / val;
            const numStr = `${num}`;
            const valStr = `${val}`;
            const trimmedNumber = numStr.endsWith(valStr)
              ? Number(numStr.slice(0, numStr.lastIndexOf(valStr)))
              : -1;
            return trimmedNumber;
          })
        )
        .filter((num) => Number.isInteger(num) && num >= 0);
    },
    [result]
  );
  return results.filter((result) => result === 0).length > 0;
});

log(sum(filteredEquationsPt2.map(({ result }) => result)));
