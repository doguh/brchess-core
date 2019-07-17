import Piece from './pieces/Piece';
import Color from './Color';
import Board from './Board';

export default class Square {
  /**
   * column 0-7 (file)
   */
  public readonly x: number;
  /**
   * row 0-7 (rank)
   * @returns {number}
   */
  public readonly y: number;
  /**
   * column a-h (x)
   */
  public readonly file: string;
  /**
   * row 1-8 (y)
   */
  public readonly rank: string;
  /**
   * color
   */
  public readonly color: Color;
  /**
   * name
   * @example "a1"
   */
  public readonly name: string;

  private _piece: Piece = null;

  /**
   * new Square
   * @param x column 0-7 (file)
   * @param y row 0-7 (rank)
   * @param color black or white
   */
  constructor(x: number, y: number, color: Color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.file = String.fromCharCode(this.x + 97);
    this.rank = `${this.y + 1}`;
    this.name = `${this.file}${this.rank}`;
  }

  /**
   * piece currently located on this square
   * @return {Piece}
   */
  public get piece(): Piece {
    return this._piece;
  }

  public set piece(piece: Piece) {
    if (piece && this._piece !== null) {
      throw new Error('Trying to put piece on an occupied square');
    }
    this._piece = piece;
    if (piece && piece.square !== this) {
      piece.square = this;
    }
  }
}
