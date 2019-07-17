import Movement, { makeMove } from '../Movement';
import Piece from './Piece';
import { KingType } from '../PieceType';

const movements: Movement[] = [
  makeMove(1, 0),
  makeMove(1, 1),
  makeMove(1, -1),
  makeMove(0, 1),
  makeMove(0, -1),
  makeMove(-1, 0),
  makeMove(-1, 1),
  makeMove(-1, -1),
];

export default class King extends Piece {
  constructor() {
    super(KingType, movements);
  }
}
