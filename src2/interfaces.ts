import { PlayerState, PieceState, BoardState } from './types';

export interface IComponent {
  state: any;
  setState(state: any): void;
  destroy: () => void;
}

export interface ISquare {
  x: number;
  y: number;
  color: string;
  piece: Piece;
  file: string;
  rank: string;
  name: string;
}

export class Square implements ISquare {
  x: number;
  y: number;
  color: string;
  piece: Piece; // attention à cette référence non destroyed!

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  get file(): string {
    return String.fromCharCode(this.x + 97);
  }
  get rank(): string {
    return `${this.y + 1}`;
  }
  get name(): string {
    return this.file + this.rank;
  }
}

export class Component implements IComponent {
  state: any;
  constructor(initialState: any = null, initOptions: any = null) {
    this.init(initOptions);
    this.setState(initialState);
  }
  init(options: any): void {}
  setState(state: any): void {}
  destroy(): void {
    this.state = null;
  }
}

const WIDTH: number = 8;
const HEIGHT: number = 8;

export class Board extends Component {
  state: BoardState;
  squares: Square[];
  player1: Player;
  player2: Player;

  init(options: any): void {
    const len = WIDTH * HEIGHT;
    let x: number;
    let y: number;
    let color: string;

    this.squares = [];
    for (let i: number = 0; i < len; i++) {
      x = i % WIDTH;
      x === 0 && i > 0 && y++;
      color = x % 2 === y % 2 ? 'black' : 'white';
      this.squares[i] = new Square(x, y, color);
    }
  }

  setState(state: BoardState): void {
    this.state = state;

    if (!this.player1) {
      this.player1 = new Player(state.player1, this);
    } else if (this.player1.state !== state.player1) {
      this.player1.setState(state.player1);
    }

    if (!this.player2) {
      this.player2 = new Player(state.player2, this);
    } else if (this.player2.state !== state.player2) {
      this.player2.setState(state.player2);
    }

    // todo squares (à faire ici, pas dans player/piece... oupa?)
  }

  destroy(): void {
    this.state = null;
    this.squares = null; // maybe destroy each square
    if (this.player1) this.player1.destroy();
    this.player1 = null;
    if (this.player2) this.player2.destroy();
    this.player2 = null;
  }
}

export class Player extends Component {
  state: PlayerState;
  board: Board;
  pieces: Piece[];

  constructor(initialState: PlayerState, board: Board) {
    super(initialState);
    this.board = board;
  }

  setState(state: PlayerState): void {
    this.state = state;

    if (!this.pieces) {
      this.pieces = [];
    }
    const len = state.pieces.length;
    while (len < this.pieces.length) {
      // we should never enter here, but just in case...
      this.pieces.pop().destroy();
    }
    for (let i: number = 0; i < len; i++) {
      const pieceState: PieceState = state.pieces[i];
      const piece: Piece = this.pieces[i];
      if (!piece) {
        this.pieces[i] = new Piece(pieceState, this);
      } else if (piece.state !== pieceState) {
        piece.setState(pieceState);
      }
    }
  }

  destroy(): void {
    super.destroy();
    this.board = null;
    if (this.pieces) {
      while (this.pieces.length) {
        this.pieces.pop().destroy();
      }
    }
    this.pieces = null;
  }
}

export class Piece extends Component {
  state: PieceState;
  player: Player;

  constructor(initialState: PieceState, player: Player) {
    super(initialState);
    this.player = player;
  }

  setState(state: PieceState): void {
    this.state = state;
  }

  destroy(): void {
    super.destroy();
    this.player = null;
  }
}
