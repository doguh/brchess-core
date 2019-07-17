import PieceType from '../PieceType';
import Player from '../Player';
import Movement from '../Movement';
import Square from '../Square';
import Board from '../Board';
import { PieceState } from '../State';

export default class Piece {
  /**
   * the piece type (king, queen, rook, etc...)
   */
  public readonly type: PieceType;
  /**
   * list of possible movements
   */
  public readonly movements: Movement[];

  private _square: Square;
  private _moveCount: number = 0;
  private _player: Player = null;

  constructor(type: PieceType, movements: Movement[]) {
    this.type = type;
    this.movements = movements;
  }

  /**
   * number of times this piece has been moved
   * during the game
   * @return {number}
   */
  public get moveCount(): number {
    return this._moveCount;
  }

  /**
   * the Board instance on which is this piece
   * @return {Board}
   */
  public get board(): Board {
    return this.player.board;
  }

  /**
   * square where is currently located this piece
   * @return {Square}
   */
  public get square(): Square {
    return this._square;
  }

  public set square(square: Square) {
    if (square && square.piece && square.piece !== this) {
      throw new Error('Trying to put piece on an occupied square');
    }
    this._square = square;
    if (square && square.piece !== this) {
      square.piece = this;
    }
  }

  /**
   * the player who owns this piece
   * @returns {Player}
   */
  public get player(): Player {
    return this._player;
  }

  public set player(player: Player) {
    if (this._player) {
      throw new Error("Trying to change a piece's player");
    }
    this._player = player;
  }

  /**
   * list all squares where this piece can move to
   * @return {Square[]}
   */
  public getValidMoves(): Square[] {
    const squares: Square[] = [];

    let x: number = 0;
    let y: number = 0;
    let repeat: number = 0;
    let hypothetic: Square = null;
    this.movements.forEach((movement: Movement) => {
      repeat = 0;
      hypothetic = this.square;
      while (repeat < movement.repeat) {
        x = hypothetic.x + movement.x * this.player.side.x;
        y = hypothetic.y + movement.y * this.player.side.y;
        hypothetic = this.board.getSquare(x, y);
        if (
          // si la case existe
          hypothetic &&
          // et qu'elle est vide ou occupée par un ennemi
          (hypothetic.piece === null ||
            hypothetic.piece.player.color !== this.player.color) &&
          // et que la condition du movement est remplie
          (movement.condition === null ||
            movement.condition(
              movement,
              this.square,
              hypothetic,
              this,
              this.board,
              repeat
            ))
        ) {
          squares.push(hypothetic);
          repeat++;
          if (hypothetic.piece) {
            // si il y a une piece sur cette case
            // on ne pourra pas répeter plus ce mouvement
            return;
          }
        } else {
          // sinon, on ne va pas plus loin
          // car on ne pourra pas répeter ce mouvement
          return;
        }
      }
    });

    return squares;
  }

  /**
   * returns the state of this Piece
   * @returns {PieceState}
   */
  public getState(): PieceState {
    return {
      type: this.type.name,
      x: this.square ? this.square.x : null,
      y: this.square ? this.square.y : null,
      moveCount: this._moveCount,
    };
  }
}
