import path from 'node:path';
import { readLines } from '../../fileParser';
import fs from 'node:fs';
import { PositionAndVelocity } from '../../types';
import { log } from '../../logger.ts';
import { writeGridToFile } from '../../grid';

const gridWidth = 101;
const gridHeight = 103;

const gridDirectory = 'solutions/14/grids';

fs.readdirSync(gridDirectory).forEach((f) =>
  fs.rmSync(`${gridDirectory}/${f}`)
);

const parsedRobotInfos = readLines(
  path.resolve(),
  'solutions/14/input.txt'
).map((line) => {
  const [position, velocity] = line
    .split(' ')
    .map((item) => item.split('=')[1]);
  const robotInfo = {
    position: {
      x: Number(position.split(',')[0]),
      y: Number(position.split(',')[1]),
    },
    velocity: {
      x: Number(velocity.split(',')[0]),
      y: Number(velocity.split(',')[1]),
    },
  };
  return robotInfo;
});

const robotInfosPt1Copy = JSON.parse(JSON.stringify(parsedRobotInfos));

const moveRobots = (robotInfos: PositionAndVelocity[], forwards = true) => {
  robotInfos.forEach((robotInfo) => {
    robotInfo.position.x = forwards
      ? robotInfo.position.x + robotInfo.velocity.x
      : robotInfo.position.x - robotInfo.velocity.x;
    robotInfo.position.x =
      robotInfo.position.x < 0
        ? gridWidth + robotInfo.position.x
        : robotInfo.position.x;
    robotInfo.position.x = robotInfo.position.x % gridWidth;

    robotInfo.position.y = forwards
      ? robotInfo.position.y + robotInfo.velocity.y
      : robotInfo.position.y - robotInfo.velocity.y;
    robotInfo.position.y =
      robotInfo.position.y < 0
        ? gridHeight + robotInfo.position.y
        : robotInfo.position.y;
    robotInfo.position.y = robotInfo.position.y % gridHeight;
  });
};

for (let seconds = 0; seconds < 100; seconds++) {
  moveRobots(robotInfosPt1Copy);
}

const gridXMidPoint = Math.floor(gridWidth / 2);
const gridYMidPoint = Math.floor(gridHeight / 2);

const remainingRobotInfos = robotInfosPt1Copy.filter(
  (robotInfo) =>
    robotInfo.position.x !== gridXMidPoint &&
    robotInfo.position.y !== gridYMidPoint
);

const quadrant1RobotCount = remainingRobotInfos.filter(
  (robotInfo) =>
    robotInfo.position.x < gridXMidPoint && robotInfo.position.y < gridYMidPoint
).length;

const quadrant2RobotCount = remainingRobotInfos.filter(
  (robotInfo) =>
    robotInfo.position.x > gridXMidPoint && robotInfo.position.y < gridYMidPoint
).length;

const quadrant3RobotCount = remainingRobotInfos.filter(
  (robotInfo) =>
    robotInfo.position.x < gridXMidPoint && robotInfo.position.y > gridYMidPoint
).length;

const quadrant4RobotCount = remainingRobotInfos.filter(
  (robotInfo) =>
    robotInfo.position.x > gridXMidPoint && robotInfo.position.y > gridYMidPoint
).length;

const pt1Answer =
  quadrant1RobotCount *
  quadrant2RobotCount *
  quadrant3RobotCount *
  quadrant4RobotCount;

// Part 2
const robotInfosPt2Copy = JSON.parse(JSON.stringify(parsedRobotInfos));

const allRobotsUniquelyPositioned = (robotInfos: PositionAndVelocity) =>
  robotInfosPt2Copy.every(
    (robotInfo, index) =>
      !robotInfosPt2Copy.some(
        (robotInfo2, index2) =>
          index !== index2 &&
          robotInfo.position.x === robotInfo2.position.x &&
          robotInfo.position.y === robotInfo2.position.y
      )
  );

let seconds = 0;
while (true) {
  seconds++;
  moveRobots(robotInfosPt2Copy);

  // if (seconds > 6600)
  //   await printGridToConsole(
  //     gridHeight,
  //     gridWidth,
  //     robotInfosPt2Copy.map((robotInfo) => robotInfo.position)
  //   );

  if (allRobotsUniquelyPositioned(robotInfosPt2Copy)) {
    writeGridToFile(gridDirectory, `${seconds}`, gridHeight, gridWidth);
    break;
  }
}

log(pt1Answer);
log(seconds);
