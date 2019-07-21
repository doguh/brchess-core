const Piece = require('./Piece');
const { create: makeMove } = require('../Movement');

const movements = [
  makeMove(1, 0, 7),
  makeMove(0, 1, 7),
  makeMove(0, -1, 7),
  makeMove(-1, 0, 7),
];

class Rook extends Piece {
  constructor(positon, board, player) {
    super(Piece.TYPE_ROOK, positon, board, player, movements);
  }
}

module.exports = Rook;
