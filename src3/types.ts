export type PieceState = { type: string; color: Color; x: number; y: number };

export type BoardState = {
  whoseTurn: Color;
  pieces: PieceState[];
};

export type Square = {
  x: number;
  y: number;
  color: Color;
  piece: PieceState;
};

export type Color = 0 | 1;

const WIDTH = 8;
const HEIGHT = 8;

export class Board {
  private state: BoardState;
  private squares: Square[];

  constructor(state: BoardState = null) {
    const len = WIDTH * HEIGHT;
    let x: number;
    let y: number = 0;
    let color: Color;
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

  move(x: number, y: number, toX: number, toY: number): void {
    const piece: PieceState = this.getSquare(x, y).piece;
    if (!piece) {
      throw new Error(`No piece found in ${x},${y}`);
    }
    if (piece.color !== this.state.whoseTurn) {
      throw new Error(
        `The piece found in ${x},${y} does not belong to the current player`
      );
    }

    // do all the verification stuff

    let killed: PieceState = null;

    // dispatch move and kill events

    this.setState({
      whoseTurn: ((this.state.whoseTurn + 1) % 2) as Color,
      pieces: this.state.pieces.map((p: PieceState) => {
        if (p === piece) {
          return {
            type: p.type,
            color: p.color,
            x: toX,
            y: toY,
          };
        } else if (p === killed) {
          // on met le state de la piece tuée à null
          return null;
        } else {
          return p;
        }
      }),
    });
  }
}
