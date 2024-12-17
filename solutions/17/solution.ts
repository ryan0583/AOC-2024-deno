import path from 'node:path';
import { readLines } from '../../fileParser';
import { log } from 'node:console';

process.stdout.write('\x1Bc'); // Clear the console

const lines = readLines(path.resolve(), 'solutions/17/input.txt');

let regA = Number(lines[0].split(': ')[1]);
let regB = Number(lines[1].split(': ')[1]);
let regC = Number(lines[2].split(': ')[1]);

const program = lines[4].split(': ')[1].split(',').map(Number);

const getComboOperand = (literalOperand: number) => {
  if (literalOperand <= 3) return literalOperand;
  if (literalOperand === 4) return regA;
  if (literalOperand === 5) return regB;
  if (literalOperand === 6) return regC;
  return 0; // should never happen
};

const division = (literalOperand: number) =>
  Math.trunc(regA / Math.pow(2, getComboOperand(literalOperand)));

const output = [] as Number[];

let insNum = 0;
while (insNum < program.length) {
  let shouldIncrement = true;
  const opcode = program[insNum];
  const literalOperand = program[insNum + 1];
  // log(opcode);
  if (opcode === 0) {
    regA = division(literalOperand);
  } else if (opcode === 1) {
    regB ^= literalOperand;
  } else if (opcode === 2) {
    regB = getComboOperand(literalOperand) % 8;
  } else if (opcode === 3) {
    if (regA !== 0) {
      insNum = literalOperand;
      shouldIncrement = false;
    }
  } else if (opcode === 4) {
    regB ^= regC;
  } else if (opcode === 5) {
    output.push(getComboOperand(literalOperand) % 8);
  } else if (opcode === 6) {
    regB = division(literalOperand);
  } else if (opcode === 7) {
    regC = division(literalOperand);
  }
  if (shouldIncrement) insNum = insNum + 2;
}

log(output.join(','));
