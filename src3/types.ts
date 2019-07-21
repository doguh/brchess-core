type PieceState = { type: string; color: number; x: number; y: number };

type BoardState = {
  whoseTurn: number;
  pieces: PieceState[];
};

type Square = {
  x: number;
  y: number;
  color: number;
  piece: PieceState;
};

const WIDTH = 8;
const HEIGHT = 8;

class Board {
  private state: BoardState;
  private squares: Square[];

  constructor(state: BoardState) {
    const len = WIDTH * HEIGHT;
    let x: number;
    let y: number;
    let color: number;

    this.squares = [];
    for (let i: number = 0; i < len; i++) {
      x = i % WIDTH;
      x === 0 && i > 0 && y++;
      color = x % 2 === y % 2 ? 0 : 1;
      this.squares[i] = { x, y, color, piece: null };
    }

    if (state) {
      this.setState(state);
    }
  }

  setState(state: BoardState) {
    if (this.state && this.state.pieces.length !== state.pieces.length) {
      // si le nombre de pièces a changé, maybe do something
    }

    for (let i = 0; i < state.pieces.length; i++) {
      const newPiece: PieceState = state.pieces[i];
      const oldPiece: PieceState = this.state && this.state.pieces[i];

      if (
        !oldPiece ||
        !newPiece ||
        oldPiece.x !== newPiece.x ||
        oldPiece.y !== newPiece.y ||
        oldPiece.type !== newPiece.type ||
        oldPiece.color !== newPiece.color
      ) {
        if (oldPiece) {
          const square: Square = this.getSquare(oldPiece.x, oldPiece.y);
          if (square.piece === oldPiece) square.piece = null;
        }

        if (newPiece) {
          const square: Square = this.getSquare(newPiece.x, newPiece.y);
          square.piece = newPiece;
        }
      }
    }

    this.state = state;
  }

  getState(): BoardState {
    return this.state;
  }

  getSquare(x: number, y: number): Square {
    return this.squares[x + y * WIDTH];
  }
}
