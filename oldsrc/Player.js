const Position = require('./Position');
const Side = require('./Side');
const { King, Queen, Bishop, Rook, Knight, Pawn } = require('./pieces');

class Player {
  constructor(color, side) {
    this.color = color;
    this.side = side;
    this.pieces = [];
  }

  initPieces(board) {
    const headsRank = this.side === Side.BOTTOM ? 1 : 8;
    this.pieces = [
      new King(new Position(5, headsRank), board, this),
      new Queen(new Position(4, headsRank), board, this),
      new Bishop(new Position(3, headsRank), board, this),
      new Bishop(new Position(6, headsRank), board, this),
      new Knight(new Position(2, headsRank), board, this),
      new Knight(new Position(7, headsRank), board, this),
      new Rook(new Position(1, headsRank), board, this),
      new Rook(new Position(8, headsRank), board, this),
    ];

    const pawnsRank = this.side === Side.BOTTOM ? 2 : 7;
    for (let i = 1; i <= 8; i++) {
      this.pieces.push(new Pawn(new Position(i, pawnsRank), board, this));
    }

    return this.pieces;
  }
}

module.exports = Player;
