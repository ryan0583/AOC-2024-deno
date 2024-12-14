import path from 'node:path';
import { readLines } from '../../fileParser';
import { log } from '../../logger';
import { sum } from '../../arrays';

const lines = readLines(path.resolve(), 'solutions/5/input.txt');

const blankLineIndex = lines.indexOf('');

const pageOrderRules = lines
  .slice(0, blankLineIndex)
  .map((rule) => rule.split('|'));

const numbersWeCareAbout = [...new Set(pageOrderRules.flat())];

const numbersBeforeMap = pageOrderRules.reduce(
  (acc, rule) => ({
    ...acc,
    [rule[1]]: [...(acc[rule[1]] || []), rule[0]],
  }),
  {}
);

const numbersAfterMap = pageOrderRules.reduce(
  (acc, rule) => ({
    ...acc,
    [rule[0]]: [...(acc[rule[0]] || []), rule[1]],
  }),
  {}
);

const updatePageNumbers = lines
  .slice(blankLineIndex + 1)
  .map((line) => line.split(','));

const inCorrectOrder = (update: string[]) =>
  update.every((pageNumber, index) => {
    if (!numbersWeCareAbout.includes(pageNumber)) return true;
    const allowedBefore = numbersBeforeMap[pageNumber] || [];
    const allowedAfter = numbersAfterMap[pageNumber] || [];

    const numbersBefore = update.slice(0, index);
    const numbersAfter = update.slice(index + 1);

    const isInRightPlace =
      numbersBefore.every(
        (before) =>
          !numbersWeCareAbout.includes(before) || allowedBefore.includes(before)
      ) &&
      numbersAfter.every(
        (after) =>
          !numbersWeCareAbout.includes(after) || allowedAfter.includes(after)
      );

    return isInRightPlace;
  });

const correctOrderUpdates = updatePageNumbers.filter(inCorrectOrder);

const sumMiddleNumbers = (arr: string[][]) =>
  sum(
    arr.map((update) => {
      const middleNumber = Number(update[Math.floor(update.length / 2)]);
      return middleNumber;
    })
  );

log(sumMiddleNumbers(correctOrderUpdates));

const inWrongOrder = updatePageNumbers.filter(
  (update) => !inCorrectOrder(update)
);

const fixedOrderUpdates = inWrongOrder.map((update) =>
  update.sort((a, b) => {
    const aAllowedBefore = numbersBeforeMap[a] || [];
    const aAllowedAfter = numbersAfterMap[a] || [];

    if (aAllowedBefore.includes(b)) return -1;
    if (aAllowedAfter.includes(b)) return 1;
    return 0;
  })
);

log(sumMiddleNumbers(fixedOrderUpdates));
