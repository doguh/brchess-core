const Piece = require('./Piece');
const { create: makeMove } = require('../Movement');

const movements = [
  makeMove(1, 0, 7),
  makeMove(1, 1, 7),
  makeMove(1, -1, 7),
  makeMove(0, 1, 7),
  makeMove(0, -1, 7),
  makeMove(-1, 0, 7),
  makeMove(-1, 1, 7),
  makeMove(-1, -1, 7),
];

class Queen extends Piece {
  constructor(positon, board, player) {
    super(Piece.TYPE_QUEEN, positon, board, player, movements);
  }
}

module.exports = Queen;
