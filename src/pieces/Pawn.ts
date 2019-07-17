import { PawnType } from '../PieceType';
import Piece from './Piece';
import Movement, { makeMove, MovementCondition } from '../Movement';
import Square from '../Square';
import Board from '../Board';

const firstMove: MovementCondition = (
  movement: Movement,
  origin: Square,
  target: Square,
  piece: Piece,
  board: Board,
  repeat: number
): boolean => {
  return !target.piece && (repeat === 0 || piece.moveCount === 0);
};

const eatMove = (
  movement: Movement,
  origin: Square,
  target: Square,
  piece: Piece,
  board: Board,
  repeat: number
): boolean => {
  return target.piece && target.piece.player.color !== piece.player.color;
};

const movements: Movement[] = [
  makeMove(0, 1, 2, firstMove),
  makeMove(1, 1, 1, eatMove),
  makeMove(-1, 1, 1, eatMove),
];

export default class Pawn extends Piece {
  constructor() {
    super(PawnType, movements);
  }
}
