import Piece from './pieces/Piece';
import Square from './Square';
import Board from './Board';

export type MovementCondition = (
  movement: Movement,
  origin: Square,
  target: Square,
  piece: Piece,
  board: Board,
  repeat: number
) => boolean;

export default interface Movement {
  /**
   * movements on the x axis (columns/files)
   */
  readonly x: number;
  /**
   * movements on the y axis (rows/ranks)
   */
  readonly y: number;
  /**
   * number of times a movement can be done,
   * it must be at least 1
   */
  readonly repeat: number;
  /**
   * function that returns true if the movement can be done,
   * false otherwise
   */
  readonly condition: MovementCondition;
}

/**
 * creates a new Movement
 * @param x
 * @param y
 * @param repeat (default=1)
 * @param condition (default=null)
 * @returns {Movement}
 */
export function makeMove(
  x: number,
  y: number,
  repeat: number = 1,
  condition: MovementCondition = null
): Movement {
  return {
    x,
    y,
    repeat,
    condition,
  };
}
