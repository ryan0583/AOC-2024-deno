import path from 'node:path';
import { read } from '../../fileParser';
import { sum } from '../../arrays';
import { log } from '../../logger';

const fileStr = read(path.resolve(), 'solutions/3/input.txt');

const multiplicationInstructions = fileStr.split('mul');

const parseMultiplicationInstruction = (instruction: string) => {
  const limitedInstruction = instruction.slice(0, 9);
  const lastBracketIndex = limitedInstruction.lastIndexOf(')');
  const limitedLimitedInstruction = limitedInstruction.slice(
    0,
    lastBracketIndex + 1
  );
  const multiplicationNumbers = limitedLimitedInstruction
    .replaceAll('(', '')
    .replaceAll(')', '')
    .split(',')
    .map(Number);
  return multiplicationNumbers[0] * multiplicationNumbers[1] || 0;
};

const multiplied = multiplicationInstructions.map(
  parseMultiplicationInstruction
);

log(sum(multiplied));

let enabled = true;

const multiplied2 = multiplicationInstructions.map((instruction) => {
  const multiplicationResult = enabled
    ? parseMultiplicationInstruction(instruction)
    : 0;

  if (instruction.includes('do')) {
    enabled = true;
  }
  if (instruction.includes("don't")) {
    enabled = false;
  }

  return multiplicationResult;
});

log(sum(multiplied2));
