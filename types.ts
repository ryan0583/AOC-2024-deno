export type Position = { x: number; y: number };

export type Direction = Position;

export interface CurrentPosition extends Position {
  direction: Direction;
}

export type PositionAndVelocity = { position: Position; velocity: Position };