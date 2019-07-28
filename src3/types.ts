export type PieceState = { type: string; color: Color; x: number; y: number };

export type BoardState = {
  whoseTurn: Color;
  pieces: PieceState[];
  turn?: number;
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
  from: Square,
  to: Square,
  repeat: number,
  getSquare: (x: number, y: number) => Square
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
  canPromote?: boolean;
};

export type MovesList = {
  from: { x: number; y: number };
  to: { x: number; y: number }[];
};

export type FlatMovesList = {
  x: number;
  y: number;
  toX: number;
  toY: number;
}[];
