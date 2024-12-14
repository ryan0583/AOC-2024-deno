import path from 'node:path';
import { readLines } from '../../fileParser';
import { log } from '../../logger';
import { Position } from '../../types';
import { sum } from '../../arrays';

const lines = readLines(path.resolve(), 'solutions/12/input.txt');

const maxY = lines.length - 1;
const maxX = lines[0].length - 1;

const isOnGrid = ({ x, y }: Position) =>
  x >= 0 && x <= maxX && y >= 0 && y <= maxY;

const plantTypeRegionsMapping = {} as Record<string, Position[][]>;

const checkArr = [
  [-1, 0],
  [0, -1],
  [1, 0],
  [0, 1],
];

const appendConnectedPoints = (
  { x, y }: Position,
  plantType: string,
  region: Position[]
) =>
  checkArr.reduce((revisedRegion, [dx, dy]) => {
    const newX = x + dx;
    const newY = y + dy;
    if (
      isOnGrid({ x: newX, y: newY }) &&
      lines[newY]?.[newX] === plantType &&
      !revisedRegion.some(({ x, y }) => x === newX && y === newY)
    ) {
      revisedRegion = appendConnectedPoints({ x: newX, y: newY }, plantType, [
        ...revisedRegion,
        { x: newX, y: newY },
      ]);
    }
    return revisedRegion;
  }, region);

for (let y = 0; y < lines.length; y++) {
  for (let x = 0; x < lines[y].length; x++) {
    const plantType = lines[y][x];
    const existingRegions = plantTypeRegionsMapping[plantType];
    if (existingRegions) {
      if (
        !existingRegions.some((region) =>
          region.some(({ x: rx, y: ry }) => rx === x && ry === y)
        )
      ) {
        //New region - find all connected points of the same type
        const region = appendConnectedPoints({ x, y }, plantType, [{ x, y }]);
        existingRegions.push(region);
      }
    } else {
      plantTypeRegionsMapping[plantType] = [
        appendConnectedPoints({ x, y }, plantType, [{ x, y }]),
      ];
    }
  }
}

const getPerimeterPoints = (region: Position[]) =>
  region.reduce<Position[]>(
    (perimeterPoints, { x, y }) =>
      checkArr.reduce((checkPerimeterPoints, [dx, dy]) => {
        if (!region.some(({ x: rx, y: ry }) => rx === x + dx && ry === y + dy))
          checkPerimeterPoints.push({ x: x + 0.25 * dx, y: y + 0.25 * dy });
        return checkPerimeterPoints;
      }, perimeterPoints),
    []
  );

log(
  sum(
    Object.values(plantTypeRegionsMapping).flatMap((value) =>
      value.map((region) => {
        const area = region.length;
        const perimeter = getPerimeterPoints(region).length;
        return perimeter;
      })
    )
  )
);

const calculateSides = (region: Position[]) =>
  getPerimeterPoints(region)
    .sort((a, b) => (a.y < b.y || (a.y === b.y && a.x < b.x) ? -1 : 1))
    .reduce<Position[][]>((sides, { x, y }) => {
      const existingSide = sides.find((side) =>
        side.find(
          ({ x: sx, y: sy }) =>
            (sx === x && sy === y - 1) || (sx === x - 1 && sy === y)
        )
      );
      if (existingSide) existingSide.push({ x, y });
      else sides.push([{ x, y }]);
      return sides;
    }, []).length;

log(
  sum(
    Object.values(plantTypeRegionsMapping).flatMap((value) =>
      value.map((region) => {
        const area = region.length;
        const sides = calculateSides(region);
        return sides;
      })
    )
  )
);
