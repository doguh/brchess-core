const Piece = require('./Piece');
const { create: makeMove } = require('../Movement');

const movements = [
  makeMove(1, 1, 7),
  makeMove(1, -1, 7),
  makeMove(-1, 1, 7),
  makeMove(-1, -1, 7),
];

class Bishop extends Piece {
  constructor(positon, board, player) {
    super(Piece.TYPE_BISHOP, positon, board, player, movements);
  }
}

module.exports = Bishop;
