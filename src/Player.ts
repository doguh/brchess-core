import Color from './Color';
import Side from './Side';
import Board from './Board';
import Piece from './pieces';
import Square from './Square';

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

  /**
   * list the pieces owned by this player
   * @returns {Piece[]}
   */
  public get pieces(): Readonly<Piece[]> {
    return this._pieces;
  }

  /**
   * adds a piece to the player's collection
   * @param piece the piece to add
   * @param square the square where the piece should be added
   * @returns {Piece} the added piece
   */
  public addPiece(piece: Piece, square: Square): Piece {
    this._pieces.push(piece);
    piece.square = square;
    piece.player = this;
    return piece;
  }
}
