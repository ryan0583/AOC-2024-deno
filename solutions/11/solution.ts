import path from 'node:path';
import { readLines } from '../../fileParser';
import { log } from '../../logger';
import { sum } from '../../arrays';

const line = readLines(path.resolve(), 'solutions/11/input.txt')[0].split(' ');

const processStones = (loopCount: number) => {
  let currStoneCounts = line.reduce(
    (acc, num) => ({ ...acc, [num]: acc[num] || 0 + 1 }),
    {} as Record<string, number>
  );
  let nextStoneCounts = {} as Record<string, number>;

  for (let i = 0; i < loopCount; i++) {
    for (const num of Object.keys(currStoneCounts)) {
      let newKeys = [] as string[];
      if (num === '0') {
        newKeys = ['1'];
      } else if (num.length % 2 === 0) {
        const firstHalf = num.slice(0, num.length / 2);
        const secondHalf = `${Number(num.slice(num.length / 2))}`;
        newKeys = [firstHalf, secondHalf];
      } else {
        newKeys = [`${Number(num) * 2024}`];
      }
  
      for (const newKey of newKeys) {
        nextStoneCounts[newKey] =
        (nextStoneCounts[newKey] || 0) + currStoneCounts[num];
      }
    }
  
    currStoneCounts = nextStoneCounts;
    nextStoneCounts = {};
  }

  return sum(Object.values(currStoneCounts))
}


log(processStones(25));
log(processStones(75));
