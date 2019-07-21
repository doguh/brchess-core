const Piece = require('./Piece');
const { create: makeMove } = require('../Movement');

const movements = [
  makeMove(-1, 2),
  makeMove(1, 2),
  makeMove(-1, -2),
  makeMove(1, -2),
  makeMove(-2, 1),
  makeMove(-2, -1),
  makeMove(2, 1),
  makeMove(2, -1),
];

class Knight extends Piece {
  constructor(positon, board, player) {
    super(Piece.TYPE_KNIGHT, positon, board, player, movements);
  }
}

module.exports = Knight;
