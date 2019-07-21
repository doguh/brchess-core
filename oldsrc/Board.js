const Piece = require('./pieces/Piece');
const Player = require('./Player');
const Color = require('./Color');
const Side = require('./Side');

class Board {
  constructor(options) {
    this.width = (options && options.width) || 8;
    this.height = (options && options.height) || 8;
    this.squares = Array(this.width)
      .fill(null)
      .map(() => Array(this.height).fill(null));

    this.player1 = new Player(Color.WHITE, Side.BOTTOM);
    this.player2 = new Player(Color.BLACK, Side.TOP);

    const placePiece = piece => {
      this.setPieceAt(piece, piece.position);
    };
    this.player1.initPieces(this).forEach(placePiece);
    this.player2.initPieces(this).forEach(placePiece);

    this.turns = 0;
    this.currentPlayer = this.player1;
  }

  move(from, to) {
    const piece = this.getPieceAt(from);
    if (!piece) {
      throw 'No piece here';
    }
    if (piece.player !== this.currentPlayer) {
      throw "Not current player's piece";
    }
    if (!piece.canMoveTo(to)) {
      throw 'Cannot move there';
    }
    if (!this.isLegalMove(piece, to)) {
      throw 'Illegal move';
    }

    const killed = this.getPieceAt(to);
    if (killed) {
      const index = killed.player.pieces.indexOf(killed);
      killed.player.pieces.splice(index, 1);
      console.log(`${killed.type} ${killed.player.color} got killed!`);
    }
    this.squares[from.file - 1][from.rank - 1] = null;
    this.squares[to.file - 1][to.rank - 1] = piece;
    piece.position = to;
    piece.moveCount++;

    if (this.currentPlayer === this.player2) {
      this.turns++;
      this.currentPlayer = this.player1;
      console.log(`tour ${this.turns + 1}`);
    } else {
      this.currentPlayer = this.player2;
    }
  }

  setPieceAt(piece, position) {
    if (this.squares[position.file - 1][position.rank - 1]) {
      throw 'Trying to place a piece on a non-empty square';
    }
    if (
      this.isValidPosition(piece.position) &&
      this.squares[piece.position.file - 1][piece.position.rank - 1] === piece
    ) {
      this.squares[piece.position.file - 1][piece.position.rank - 1] = null;
    }
    this.squares[position.file - 1][position.rank - 1] = piece;
    piece.position = position;
  }

  getPieceAt(position) {
    return this.squares[position.file - 1][position.rank - 1];
  }

  isValidPosition(position) {
    return (
      position.file >= 1 &&
      position.file <= this.width &&
      position.rank >= 1 &&
      position.rank <= this.height
    );
  }

  isLegalMove(piece, newPosition) {
    const kingPosition =
      piece.type === Piece.TYPE_KING
        ? newPosition
        : piece.player.pieces.find(p => p.type === Piece.TYPE_KING).position;
    const enemies =
      piece.player === this.player1 ? this.player2.pieces : this.player1.pieces;

    const getPieceAt = position => {
      if (position.equals(newPosition)) {
        return piece;
      } else if (position.equals(piece.position)) {
        return null;
      }
      return this.getPieceAt(position);
    };

    const isCheck = enemies.some(enemy => {
      return enemy.couldKill(kingPosition, getPieceAt);
    });
    return !isCheck;
  }

  print() {
    const out =
      '  ' +
      this.squares[0]
        .map((_, y) => `${y + 1}`.padEnd(2, ' ').substr(0, 2))
        .join(' ') +
      '\n' +
      this.squares
        .map((files, x) => {
          return (
            String.fromCharCode(x + 97) +
            ' ' +
            files
              .map((piece, y) => {
                return piece ? piece.type.substr(0, 2) : '  ';
              })
              .join('|')
          );
        })
        .join('\n-----------------------\n');

    console.log(out);
  }
}

module.exports = Board;
