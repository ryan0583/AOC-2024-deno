import path from 'node:path';
import { readLines } from '../../fileParser';
import { log } from 'node:console';
import { sum } from '../../arrays';

const lines = readLines(path.resolve(), 'solutions/19/input.txt')
  .join(';')
  .split(';;');

const towels = new Set(lines[0].split(', '));

const designs = lines[1].split(';');

const isPossibleDesign = (design: string) => {
  const indexQueue = [0] as number[];

  while (indexQueue.length > 0) {
    const nextIndex = indexQueue.shift()!;

    if (nextIndex === design.length) {
      return true;
    }

    let endIndex = design.length;

    while (endIndex > nextIndex) {
      const subDesign = design.substring(nextIndex, endIndex);

      if (towels.has(subDesign) && !indexQueue.includes(endIndex)) {
        indexQueue.push(endIndex);
      }

      endIndex--;
    }
  }

  return false;
};

log(designs.filter(isPossibleDesign).length);

const countPossibleWaysToMakeDesign = (design: string) => {
  const indexQueue = [
    {
      index: 0,
      score: 1,
    },
  ];

  let totalPossibleWays = 0;

  while (indexQueue.length > 0) {
    const { index, score } = indexQueue.shift()!;

    if (index === design.length) {
      totalPossibleWays += score;
    }

    let endIndex = design.length;

    while (endIndex > index) {
      const subDesign = design.substring(index, endIndex);

      if (towels.has(subDesign)) {
        const existingIndexQueueEntry = indexQueue.find(
          ({ index: otherIndex }) => otherIndex === endIndex
        );

        if (!existingIndexQueueEntry)
          indexQueue.push({
            index: endIndex,
            score: score,
          });
        else existingIndexQueueEntry.score += score;
      }

      endIndex--;
    }
  }

  return totalPossibleWays;
};

log(sum(designs.map(countPossibleWaysToMakeDesign)));
