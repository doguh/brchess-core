import Color from './Color';
import Side from './Side';
import Board from './Board';
import Piece from './pieces';

export default class Player {
  public readonly color: Color;
  public readonly side: Side;
  public readonly board: Board;
  private _pieces: Piece[] = [];

  constructor(color: Color, side: Side, board: Board) {
    this.color = color;
    this.side = side;
    this.board = board;
  }

  public get pieces(): Readonly<Piece[]> {
    return this._pieces;
  }

  public addPiece(piece: Piece): Player {
    this._pieces.push(piece);
    return this;
  }
}
