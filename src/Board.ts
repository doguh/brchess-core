import Square from './Square';
import Color, { ColorWhite, ColorBlack } from './Color';
import Player from './Player';
import King from './pieces/King';
import { SideBottom, SideTop } from './Side';

export default class Board {
  /**
   * board's width
   */
  public readonly width: number = 8;
  /**
   * board's height
   */
  public readonly height: number = 8;
  /**
   * list of squares on the board
   */
  private squares: Square[];
  /**
   * the first player
   */
  private player1: Player;
  /**
   * the second player
   */
  private player2: Player;

  constructor() {
    const num: number = this.width * this.height;
    this.squares = [];
    let y: number = 0;
    let color: Color = ColorWhite;
    // revert color on new y?
    const revc = this.width % 2 == 0;
    for (let i = 0; i < num; i++) {
      let x = i % this.width;
      if (x === 0 && i > 0) {
        y++;
        if (revc) {
          // dirty but does the job
          color = color === ColorWhite ? ColorBlack : ColorWhite;
        }
      }

      this.squares.push(new Square(x, y, color));
      color = color === ColorWhite ? ColorBlack : ColorWhite;
    }

    this.player1 = new Player(ColorWhite, SideBottom, this);
    this.player2 = new Player(ColorBlack, SideTop, this);
    this.initPieces(this.player1);
    this.initPieces(this.player2);
  }

  private initPieces(player: Player): void {
    const headsRank = player.side === SideBottom ? 0 : 7;
    player.addPiece(new King(player, this.getSquare(4, headsRank)));
    const pawnsRank = player.side === SideBottom ? 1 : 6;
    for (let i = 1; i <= 8; i++) {}
  }

  /**
   * returns a square
   * @param x x
   * @param y y
   * @returns {Square}
   */
  public getSquare(x: number, y: number): Square {
    return this.squares[x + y * this.width];
  }

  /**
   * returns a square
   * @param name square name
   * @returns {Square}
   */
  public getSquareByName(name: string): Square {
    const x = name.toLowerCase().charCodeAt(0) - 97;
    const y = parseInt(name.charAt(1), 10) - 1;
    return this.getSquare(x, y);
  }
}
