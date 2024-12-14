import path from 'node:path';
import { readLines } from '../../fileParser';
import { log } from '../../logger';
import { sum } from '../../arrays';
import { Position } from '../../types';

const lines = readLines(path.resolve(), 'solutions/13/input.txt')
  .join(';')
  .split(';;')
  .map((line) => line.split(';'))
  .map((line) => {
    const buttonA = line[0].split(' ');
    const buttonAX = buttonA[2].split('+')[1].replace(',', '');
    const buttonAY = buttonA[3].split('+')[1];
    const buttonB = line[1].split(' ');
    const buttonBX = buttonB[2].split('+')[1].replace(',', '');
    const buttonBY = buttonB[3].split('+')[1];
    const prize = line[2].split(' ');
    const prizeX = prize[1].split('=')[1].replace(',', '');
    const prizeY = prize[2].split('=')[1];

    return {
      A: { x: Number(buttonAX), y: Number(buttonAY) },
      B: { x: Number(buttonBX), y: Number(buttonBY) },
      prize: {
        x: Number(prizeX),
        y: Number(prizeY),
      },
    };
  });

const solveSimultaneousEquations = (
  x1: number,
  x2: number,
  xT: number,
  y1: number,
  y2: number,
  yT: number
) => {
  // Multiply coefficients of equation 1 by y2
  const adjustedX1 = x1 * y2;
  const adjustedXT = xT * y2;

  // Multiply coefficients of equation 2 by x2
  const adjustedY1 = y1 * x2;
  const adjustedYT = yT * x2;

  // Find a by subtracting equation 2 from equation 1 (this eliminates b)
  const a = (adjustedXT - adjustedYT) / (adjustedX1 - adjustedY1);

  // Find b by substituting a into equation 1
  const b = (xT - a * x1) / x2;

  return [a, b];
};

const findCosts = (
  linesToCheck: { A: Position; B: Position; prize: Position }[]
) =>
  sum(
    linesToCheck.map(({ A, B, prize }) => {
      const solution = solveSimultaneousEquations(
        A.x,
        B.x,
        prize.x,
        A.y,
        B.y,
        prize.y
      );

      return Number.isInteger(solution[0]) && Number.isInteger(solution[1])
        ? 3 * solution[0] + solution[1]
        : 0;
    })
  );

log(findCosts(lines));

log(
  findCosts(
    lines.map(({ A, B, prize }) => ({
      A,
      B,
      prize: { x: prize.x + 10000000000000, y: prize.y + 10000000000000 },
    }))
  )
);
