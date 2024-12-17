import path from 'node:path';
import { readLines } from '../../fileParser';
import { log } from 'node:console';

process.stdout.write('\x1Bc'); // Clear the console

const lines = readLines(path.resolve(), 'solutions/17/input.txt');

const program = lines[4].split(': ')[1].split(',').map(Number);

const runProgram = (regA: bigint) => {
  let regB = BigInt(lines[1].split(': ')[1]);
  let regC = BigInt(lines[2].split(': ')[1]);

  const getComboOperand = (literalOperand: number) => {
    if (literalOperand <= 3) return BigInt(literalOperand);
    if (literalOperand === 4) return regA;
    if (literalOperand === 5) return regB;
    if (literalOperand === 6) return regC;
    return BigInt(0); // should never happen
  };

  const division = (literalOperand: number) =>
    regA / 2n ** getComboOperand(literalOperand);

  const output = [] as BigInt[];

  let insNum = 0;
  while (insNum < program.length) {
    let shouldIncrement = true;
    const opcode = program[insNum];
    const literalOperand = program[insNum + 1];
    // log(opcode);
    if (opcode === 0) {
      regA = division(literalOperand);
    } else if (opcode === 1) {
      regB ^= BigInt(literalOperand);
    } else if (opcode === 2) {
      regB = getComboOperand(literalOperand) % 8n;
    } else if (opcode === 3) {
      if (regA !== 0n) {
        insNum = literalOperand;
        shouldIncrement = false;
      }
    } else if (opcode === 4) {
      regB ^= regC;
    } else if (opcode === 5) {
      output.push(getComboOperand(literalOperand) % 8n);
    } else if (opcode === 6) {
      regB = division(literalOperand);
    } else if (opcode === 7) {
      regC = division(literalOperand);
    }
    if (shouldIncrement) insNum = insNum + 2;
  }
  return output;
};

log(runProgram(BigInt(lines[0].split(': ')[1])).join(','));

let regA = 0;
let index = program.length - 1;

while (index >= 0) {
  const output = runProgram(BigInt(regA)).join(',');
  if (output === program.slice(index).join(',')) {
    index--;
    if (index >= 0) {
      regA = regA * 8;
    }
  } else {
    regA++;
  }
}

log(regA);
