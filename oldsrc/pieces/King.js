const Piece = require('./Piece');
const { create: makeMove } = require('../Movement');

const movements = [
  makeMove(1, 0),
  makeMove(1, 1),
  makeMove(1, -1),
  makeMove(0, 1),
  makeMove(0, -1),
  makeMove(-1, 0),
  makeMove(-1, 1),
  makeMove(-1, -1),
];

class King extends Piece {
  constructor(positon, board, player) {
    super(Piece.TYPE_KING, positon, board, player, movements);
  }
}

module.exports = King;
