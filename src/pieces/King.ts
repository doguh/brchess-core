import Movement, { makeMove } from '../Movement';
import Piece from '.';
import { KingType } from '../PieceType';
import Player from '../Player';
import Square from '../Square';

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
  constructor(player: Player, square: Square) {
    super(KingType, player, movements, square);
  }
}
