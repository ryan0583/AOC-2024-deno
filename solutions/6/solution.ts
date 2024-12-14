import path from 'node:path';
import { readLines } from '../../fileParser';
import { log } from '../../logger';
import { CurrentPosition, Direction } from '../../types';

const lines = readLines(path.resolve(), 'solutions/6/input.txt');

const maxY = lines.length - 1;
const maxX = lines[0].length - 1;
const startChar = '^';
const blockChar = '#';

const getNextChar = ({ x, y, direction }: CurrentPosition) =>
  lines[y + direction.y]?.[x + direction.x] || '.';

const getNextPosition = ({ x, y, direction }: CurrentPosition) =>
  `${x + direction.x}, ${y + direction.y}`;

const turnRight = ({ direction }: { direction: Direction }) => ({
  x: -direction.y,
  y: direction.x,
});

const startY = lines.findIndex((line) => line.includes(startChar));
const startX = lines[startY].indexOf(startChar);

const initCurrentPositionsAndVisitedPositions = () => {
  const currentPosition = {
    x: startX,
    y: startY,
    direction: {
      x: 0,
      y: -1,
    }, //Checked input and it always starts with a ^
  };
  return {
    currentPosition,
    visitedPositions: new Set([`${currentPosition.x}, ${currentPosition.y}`]),
  };
};

const isOnGrid = ({ x, y }: CurrentPosition) =>
  x >= 0 && x <= maxX && y >= 0 && y <= maxY;

const getVisitedPositions = () => {
  const { currentPosition, visitedPositions } =
    initCurrentPositionsAndVisitedPositions();

  while (isOnGrid(currentPosition)) {
    visitedPositions.add(`${currentPosition.x}, ${currentPosition.y}`);

    let nextChar = getNextChar(currentPosition);
    while (nextChar === blockChar) {
      currentPosition.direction = turnRight(currentPosition);
      nextChar = getNextChar(currentPosition);
    }

    currentPosition.x = currentPosition.x + currentPosition.direction.x;
    currentPosition.y = currentPosition.y + currentPosition.direction.y;
  }
  return visitedPositions;
};

const distinctVisitedPositions = getVisitedPositions();

log(distinctVisitedPositions.size);

const loopLocations = [...distinctVisitedPositions].filter((position) => {
  const { currentPosition, visitedPositions } =
    initCurrentPositionsAndVisitedPositions();

  const positionDirections = {
    [`${currentPosition.x}, ${currentPosition.y}`]: `${currentPosition.direction.x}, ${currentPosition.direction.y}`,
  };

  let inLoop = false;

  while (!inLoop && isOnGrid(currentPosition)) {
    let nextChar = getNextChar(currentPosition);
    let nextPosition = getNextPosition(currentPosition);

    while (nextChar === blockChar || nextPosition === position) {
      currentPosition.direction = turnRight(currentPosition);
      nextChar = getNextChar(currentPosition);
      nextPosition = getNextPosition(currentPosition);
    }

    currentPosition.x = currentPosition.x + currentPosition.direction.x;
    currentPosition.y = currentPosition.y + currentPosition.direction.y;
    const positionLookup = `${currentPosition.x}, ${currentPosition.y}`;
    const directionLookup = `${currentPosition.direction.x}, ${currentPosition.direction.y}`;

    if (
      visitedPositions.has(positionLookup) &&
      positionDirections[positionLookup] === directionLookup
    )
      inLoop = true;

    positionDirections[positionLookup] = directionLookup;
    visitedPositions.add(positionLookup);
  }

  return inLoop;
});

log(loopLocations.length);
