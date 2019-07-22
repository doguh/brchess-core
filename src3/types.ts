import Board from './Board';

export type PieceState = { type: string; color: Color; x: number; y: number };

export type BoardState = {
  whiteSide: Side;
  whoseTurn: Color;
  pieces: PieceState[];
};

export type Square = {
  x: number;
  y: number;
  color: Color;
  piece: PieceState;
};

/**
 * `0` = white, `1` = black
 */
export type Color = 0 | 1;

export type MovementCondition = (
  movement: Movement,
  from: Square,
  to: Square,
  piece: PieceState,
  board: Board,
  repeat: number
) => boolean;

export type Movement = {
  x: number;
  y: number;
  repeat: number;
  condition: MovementCondition;
};

export type PieceType = {
  key: string;
  movements: Movement[];
};

export type MovesList = {
  from: { x: number; y: number };
  to: { x: number; y: number }[];
};

/**
 * `1` = bottom, `-1` = top
 */
export type Side = 1 | -1;

export type FlatMovesList = {
  x: number;
  y: number;
  toX: number;
  toY: number;
}[];
