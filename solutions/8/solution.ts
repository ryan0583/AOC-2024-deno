import path from 'node:path';
import { readLines } from '../../fileParser';
import { log } from '../../logger';
import { Position } from '../../types';

const lines = readLines(path.resolve(), 'solutions/8/input.txt');

const maxY = lines.length - 1;
const maxX = lines[0].length - 1;

const antennaPositionsLookup = {} as Record<string, { x: number; y: number }[]>;

for (let y = 0; y <= maxY; y++) {
  for (let x = 0; x <= maxX; x++) {
    const c = lines[y][x];
    if (c !== '.') {
      antennaPositionsLookup[c] = [
        ...(antennaPositionsLookup[c] || []),
        { x, y },
      ];
    }
  }
}

const xOnGrid = (x: number) => x >= 0 && x <= maxX;
const yOnGrid = (y: number) => y >= 0 && y <= maxY;

const distinctPositionsOnGrid = (arr: string[]) => [...new Set(arr)];

const getAntinodePositions = (
  getNewAntinodes: (
    firstNode: Position,
    secondNode: Position,
    xDiff: number,
    yDiff: number
  ) => string[]
) =>
  Object.values(antennaPositionsLookup).flatMap((positions) => {
    const antinodePositions = [] as string[];
    for (let i = 0; i < positions.length; i++) {
      const firstNode = positions[i];
      for (let j = i + 1; j < positions.length; j++) {
        const secondNode = positions[j];
        antinodePositions.push(
          ...getNewAntinodes(
            firstNode,
            secondNode,
            secondNode.x - firstNode.x,
            secondNode.y - firstNode.y
          )
        );
      }
    }
    return antinodePositions;
  });

const antinodePositions = distinctPositionsOnGrid(
  getAntinodePositions(
    (
      firstNode: Position,
      secondNode: Position,
      xDiff: number,
      yDiff: number
    ) => {
      const aboveAntinodeX = firstNode.x - xDiff;
      const aboveAntinodeY = firstNode.y - yDiff;
      const aboveAntinode =
        xOnGrid(aboveAntinodeX) && yOnGrid(aboveAntinodeY)
          ? [`${aboveAntinodeX},${aboveAntinodeY}`]
          : [];

      const belowAntinodeX = secondNode.x + xDiff;
      const belowAntinodeY = secondNode.y + yDiff;
      const belowAntinode =
        xOnGrid(belowAntinodeX) && yOnGrid(belowAntinodeY)
          ? [`${belowAntinodeX},${belowAntinodeY}`]
          : [];

      return [...aboveAntinode, ...belowAntinode];
    }
  )
);

log(antinodePositions.length);

const antinodePositionsPt2 = distinctPositionsOnGrid(
  getAntinodePositions(
    (
      firstNode: Position,
      secondNode: Position,
      xDiff: number,
      yDiff: number
    ) => {
      const antinodePositions = [] as string[];
      let multiplier = 1;
      let aboveNodeOnGrid = true;
      let belowNodeOnGrid = true;
      antinodePositions.push(
        `${firstNode.x},${firstNode.y}`,
        `${secondNode.x},${secondNode.y}`
      );
      while (aboveNodeOnGrid || belowNodeOnGrid) {
        if (aboveNodeOnGrid) {
          const newX = firstNode.x - multiplier * xDiff;
          const newY = firstNode.y - multiplier * yDiff;
          if (xOnGrid(newX) && yOnGrid(newY)) {
            antinodePositions.push(`${newX},${newY}`);
          } else {
            aboveNodeOnGrid = false;
          }
        }
        if (belowNodeOnGrid) {
          const newX = secondNode.x + multiplier * xDiff;
          const newY = secondNode.y + multiplier * yDiff;
          if (xOnGrid(newX) && yOnGrid(newY)) {
            antinodePositions.push(`${newX},${newY}`);
          } else {
            belowNodeOnGrid = false;
          }
        }
        multiplier++;
      }
      return antinodePositions;
    }
  )
);

log(antinodePositionsPt2.length);
