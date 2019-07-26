import { PieceType, MovementCondition, Square } from './types';
import { White } from './constantes';

const types: { [key: string]: PieceType } = {};

export function registerPieceType(t: PieceType): PieceType {
  types[t.key] = t;
  return t;
}

export function getPieceType(key: string): PieceType {
  return types[key];
}

export function makeMove(
  x: number,
  y: number,
  repeat: number = 1,
  condition: MovementCondition = null
) {
  return { x, y, repeat, condition };
}

export const King = registerPieceType({
  key: 'k',
  movements: [
    makeMove(0, 1),
    makeMove(1, 1),
    makeMove(-1, 1),
    makeMove(1, -1),
    makeMove(-1, -1),
    makeMove(0, -1),
    makeMove(1, 0),
    makeMove(-1, 0),
  ],
});

export const Queen = registerPieceType({
  key: 'q',
  movements: [
    makeMove(1, 0, 8),
    makeMove(1, 1, 8),
    makeMove(1, -1, 8),
    makeMove(0, 1, 8),
    makeMove(0, -1, 8),
    makeMove(-1, 0, 8),
    makeMove(-1, 1, 8),
    makeMove(-1, -1, 8),
  ],
});

export const Bishop = registerPieceType({
  key: 'b',
  movements: [
    makeMove(1, 1, 8),
    makeMove(1, -1, 8),
    makeMove(-1, 1, 8),
    makeMove(-1, -1, 8),
  ],
});

export const Knight = registerPieceType({
  key: 'n',
  movements: [
    makeMove(-1, 2),
    makeMove(1, 2),
    makeMove(-1, -2),
    makeMove(1, -2),
    makeMove(-2, 1),
    makeMove(-2, -1),
    makeMove(2, 1),
    makeMove(2, -1),
  ],
});

export const Rook = registerPieceType({
  key: 'r',
  movements: [
    makeMove(1, 0, 8),
    makeMove(0, 1, 8),
    makeMove(0, -1, 8),
    makeMove(-1, 0, 8),
  ],
});

const canPawnDoubleMove = (from: Square): boolean => {
  return from.piece.color === White ? from.y <= 2 : from.y >= 5;
};

const pawnMove: MovementCondition = (from, to, repeat, getSquare) => {
  return (
    (repeat === 0 || (repeat === 1 && canPawnDoubleMove(from))) &&
    to.piece === null
  );
};

const pawnKill: MovementCondition = (from, to, repeat, getSquare) => {
  return !!to.piece;
};

export const Pawn = registerPieceType({
  key: '',
  movements: [
    makeMove(0, 1, 2, pawnMove),
    makeMove(1, 1, 1, pawnKill),
    makeMove(-1, 1, 1, pawnKill),
  ],
});
