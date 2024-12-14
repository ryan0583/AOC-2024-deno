import path from 'node:path';
import { readLines } from '../../fileParser';
import { log } from '../../logger';
import { Position } from '../../types';
import { sum } from '../../arrays';

const lines = readLines(path.resolve(), 'solutions/10/input.txt');

const checkArr = [
  [-1, 0],
  [0, -1],
  [1, 0],
  [0, 1],
];

const trailheadCoords = [] as Position[];

for (let y = 0; y < lines.length; y++) {
  const line = lines[y];
  for (let x = 0; x < line.length; x++) {
    const char = line[x];
    if (char === '0') {
      trailheadCoords.push({ x, y });
    }
  }
}

const appendNextTrailPoints = (
    { x: curX, y: curY }: Position,
  currentTrail: Position[]
) => {
  if (Number(lines[curY][curX]) === 9) {
    return [currentTrail];
  }

  const allValidTrails = [] as Position[][];
  checkArr.forEach(([dx, dy]) => {
    const x = curX + dx;
    const y = curY + dy;
    if (Number(lines[y]?.[x]) === Number(lines[curY][curX]) + 1) {
      const validTrail = appendNextTrailPoints({ x, y }, [
        ...currentTrail,
        { x, y },
      ]);
      allValidTrails.push(...validTrail);
    }
  });

  return allValidTrails;
};

const trailScores = [] as number[];
for (const trailhead of trailheadCoords) {
  const allValidTrails = appendNextTrailPoints(trailhead, [trailhead]);
  const distinctEndCoords = [...new Set(allValidTrails.map((trail) => {
    const { x, y } = trail[trail.length - 1];
    return `${x},${y}`;
  }))];
  trailScores.push(distinctEndCoords.length);
}

log(sum(trailScores));

const trailScoresPt2 = [] as number[];
for (const trailhead of trailheadCoords) {
  const allValidTrails = appendNextTrailPoints(trailhead, [trailhead]);
  trailScoresPt2.push(allValidTrails.length);
}

log(sum(trailScoresPt2));
