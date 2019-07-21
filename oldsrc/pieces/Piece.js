const Position = require('../Position');

class Piece {
  constructor(type, position, board, player, movements) {
    this.type = type;
    this.position = position;
    this.board = board;
    this.player = player;
    this.movements = movements;
    this.moveCount = 0;
  }

  getValidMoves() {
    const moves = [];
    const p = new Position();
    this.movements.forEach(movement => {
      let repeat = 0;
      p.copy(this.position);
      do {
        // on prend la position actuelle de la piece et on applique le mouvement
        p.applyMovement(movement);
        if (!this.board.isValidPosition(p)) {
          // si la nouvelle position est invalide, on quitte
          return;
        } else if (
          movement.condition &&
          !movement.condition(this, p, movement)
        ) {
          // si la condition pour réaliser ce movement n'est pas remplie, on quitte
          return;
        } else {
          const piece = this.board.getPieceAt(p);
          if (piece) {
            // si il y a une piece sur le chemin, on quitte
            // si la piece en question est une piece ennemie, on peut quand même aller sur cette case
            // mais on n'ira pas plus loin
            if (piece.player.color !== this.player.color) {
              moves.push(p.clone());
            }
            return;
          }
        }
        if (this.board.isLegalMove(this, p)) {
          moves.push(p.clone());
        }
        // on répète le mouvement
        repeat++;
      } while (repeat <= movement.repeat);
    });
    return moves;
  }

  canKill(position) {
    return this.couldKill(position, this.board.getPieceAt.bind(this.board));
  }

  couldKill(position, getPieceAt) {
    return this.couldMoveTo(position, getPieceAt);
  }

  canMoveTo(position) {
    return this.couldMoveTo(position, this.board.getPieceAt.bind(this.board));
  }

  couldMoveTo(position, getPieceAt) {
    const p = new Position();
    return this.movements.some(movement => {
      let repeat = 0;
      p.copy(this.position);
      do {
        // on prend la position actuelle de la piece et on applique le mouvement
        p.applyMovement(movement);
        if (!this.board.isValidPosition(p)) {
          // si la nouvelle position est invalide, on quitte
          return false;
        } else if (
          movement.condition &&
          !movement.condition(this, p, movement)
        ) {
          // si la condition pour réaliser ce movement n'est pas remplie, on quitte
          return false;
        } else {
          const piece = getPieceAt(p);
          if (piece) {
            // si il y a une piece sur le chemin, on quitte
            // si la piece en question est une piece ennemie, on peut quand même aller sur cette case
            // mais on n'ira pas plus loin
            return piece.player.color === this.player.color
              ? false
              : p.equals(position);
          }
        }
        if (p.equals(position)) {
          // si la position trouvée est égale à la position cherchée, on quitte
          return true;
        }
        // on répète le mouvement
        repeat++;
      } while (repeat <= movement.repeat);
      return false;
    });
  }
}

Piece.TYPE_KING = 'roi';
Piece.TYPE_QUEEN = 'reine';
Piece.TYPE_BISHOP = 'fou';
Piece.TYPE_KNIGHT = 'cavalier';
Piece.TYPE_ROOK = 'tour';
Piece.TYPE_PAWN = 'pion';

module.exports = Piece;
