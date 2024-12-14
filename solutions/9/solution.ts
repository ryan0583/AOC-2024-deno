import path from 'node:path';
import { readLines } from '../../fileParser';
import { log } from '../../logger';
import { sum } from '../../arrays';

const lines = readLines(path.resolve(), 'solutions/9/input.txt');

const filesAndSpaces = lines[0].split('').flatMap((c, index) => {
  const charToAppend = index % 2 === 0 ? `${index / 2}` : '.';
  const arr = [] as string[];
  for (let i = 0; i < parseInt(c); i++) {
    arr.push(charToAppend);
  }
  return arr;
});

const filesAndSpacesPt1 = [...filesAndSpaces]
const originalLength = filesAndSpacesPt1.filter(c => c === '.').length;
for (let i=0; i<originalLength; i++) {
    const char = filesAndSpacesPt1.pop() as string;
    if (char !== '.') {
        const dotIndex = filesAndSpacesPt1.indexOf('.');
        filesAndSpacesPt1[dotIndex] = char;
    }
}

log(sum(filesAndSpacesPt1.map((c, index) => Number(c) * index)));

let fileId = Math.max(
  ...filesAndSpaces.filter((c) => c !== '.').map((c) => parseInt(c))
);

while (fileId >= 0) {
  log(fileId);
  const char = `${fileId}`;
  const blocksToMove = [] as string[];
  let nextChar = char;
  const lastFileIdIndex = filesAndSpaces.lastIndexOf(char);
  let nextCharIndex = lastFileIdIndex;
  while (nextChar === char) {
    blocksToMove.push(nextChar);
    nextCharIndex--;
    nextChar = filesAndSpaces[nextCharIndex];
  }
  const fileLength = blocksToMove.length;
  const emptyBlockArr = new Array(fileLength).fill('.');
  const emptyBlock = emptyBlockArr.join(',');
  const filesAndSpacesStr = filesAndSpaces.join(',');
  const emptyBlockStringIndex = filesAndSpacesStr.indexOf(emptyBlock);

  if (emptyBlockStringIndex >= 0) {
    const emptyBlockArrayIndex = filesAndSpacesStr
      .slice(0, emptyBlockStringIndex)
      .split('')
      .filter((c) => c === ',').length;
    if (emptyBlockArrayIndex < lastFileIdIndex) {
      filesAndSpaces.splice(
        lastFileIdIndex - fileLength + 1,
        fileLength,
        ...emptyBlockArr
      );
      filesAndSpaces.splice(emptyBlockArrayIndex, fileLength, ...blocksToMove);
    }
  }
  fileId--;
}

log(sum(filesAndSpaces.map((c, index) => (c !== '.' ? Number(c) * index : 0))));
