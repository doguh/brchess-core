import { PieceType, MovementCondition } from './types';

const types: { [key: string]: PieceType } = {};

export function register(t: PieceType): PieceType {
  types[t.key] = t;
  return t;
}

export function get(key: string): PieceType {
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

export const King = register({
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
