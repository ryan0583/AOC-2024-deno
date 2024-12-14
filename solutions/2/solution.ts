import path from 'node:path';
import { readLines } from "../../fileParser";
import { log } from "../../logger";

const lines = readLines(path.resolve(), 'solutions/2/input.txt');

const splitInput = lines.map((line) => line.split(' ').map(Number));

const lineIsSafe = (line: number[]) => {
    const isFirstDiffIncrease = line[1] > line[0];
    const isSafe = line.every((num, index) => {
        if (index === 0) return true
        const isSameDirection = (num > line[index - 1]) === isFirstDiffIncrease;
        const diff = num - line[index - 1];
        return isSameDirection && 1 <= Math.abs(diff) && Math.abs(diff) <= 3;
    })
    return isSafe
}

const safe = splitInput.map(lineIsSafe);

log(safe.filter(Boolean).length);

const adjustedSafe = splitInput.map((line) => {
    let safe = lineIsSafe(line);

    if (!safe) {
        for (let i=0; i<line.length; i++) {
            const newLine = [...line.slice(0, i), ...line.slice(i+1)];
            if (lineIsSafe(newLine)) {
                safe = true;
                break;
            }
        }
    }

    return safe;
})

log(adjustedSafe.filter(Boolean).length);