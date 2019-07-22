import {
  BoardState,
  Square,
  Color,
  PieceState,
  MovesList,
  PieceType,
  Movement,
  FlatMovesList,
} from './types';
import { getPieceType } from './pieces';

const WIDTH = 8;
const HEIGHT = 8;

export default class Board {
  private state: BoardState;
  private squares: Square[];
  private possibleMoves: MovesList[];
  private mandatoryMoves: MovesList[];
  private currentKing: PieceState;
  private ennemyKing: PieceState;

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

  setState(nextState: BoardState) {
    // demap old state positions
    if (this.state) {
      this.state.pieces.forEach(p => (this.getSquare(p.x, p.y).piece = null));
    }
    // map new state positions
    nextState.pieces.forEach(p => {
      this.getSquare(p.x, p.y).piece = p;
      // ref kings for faster check test
      if (p.type === 'k') {
        if (p.color === nextState.whoseTurn) {
          this.currentKing = p;
        } else {
          this.ennemyKing = p;
        }
      }
    });

    this.state = nextState;
    this.invalidatePossibleMoves();
  }

  getState(): BoardState {
    return this.state;
  }

  getPiece(x: number, y: number): PieceState {
    return this.getSquare(x, y).piece;
  }

  getSquare(x: number, y: number): Square {
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) {
      return null;
    }
    return this.squares[x + y * WIDTH];
  }

  move(x: number, y: number, toX: number, toY: number): void {
    const piece: PieceState = this.getPiece(x, y);
    if (!piece) {
      throw new Error(`No piece found in ${x},${y}`);
    }
    if (piece.color !== this.state.whoseTurn) {
      throw new Error(
        `The piece found in ${x},${y} does not belong to the current player`
      );
    }
    if (piece.x !== x || piece.y !== y) {
      throw new Error(
        `Piece position {${piece.x},${
          piece.y
        }} differs from {${x},${y}}. This should never happen: the state has probably been mutated.`
      );
    }

    if (this.mandatoryMoves.length) {
      /**
       * si il y a des mouvements obligatoires,
       * on vérifie que le mouvement en fait partie
       */
      if (!isMoveInList(x, y, toX, toY, this.mandatoryMoves)) {
        throw new Error(
          'Cannot make this move because there are mandatory moves'
        );
      }
    } else {
      /**
       * si il n'y a pas de mouvement obligatoire,
       * on vérifie que le mouvement est possible
       */
      if (!isMoveInList(x, y, toX, toY, this.possibleMoves)) {
        throw new Error('Illegal move');
      }
    }

    // si il y a une piece sur la case d'arrivée, elle est tuée
    const killed: PieceState = this.getPiece(toX, toY);

    // TODO maybe dispatch move and kill events

    this.setState({
      whiteSide: this.state.whiteSide,
      whoseTurn: ((this.state.whoseTurn + 1) % 2) as Color,
      pieces: this.state.pieces.reduce<PieceState[]>(
        (acc: PieceState[], p: PieceState): PieceState[] => {
          if (p === piece) {
            acc.push({
              type: p.type,
              color: p.color,
              x: toX,
              y: toY,
            });
          } else if (p !== killed) {
            // on retire de la liste la piece tuée
            acc.push(p);
          }
          return acc;
        },
        []
      ),
    });
  }

  getMandatoryMoves(): FlatMovesList {
    return flatMovesList(this.mandatoryMoves);
  }

  getPossibleMoves(): FlatMovesList {
    return flatMovesList(this.possibleMoves);
  }

  invalidatePossibleMoves(): void {
    this.possibleMoves = [];
    this.mandatoryMoves = [];

    // multiplicateur des mouvements selon le côté du joueur (1 ou -1):
    // les pions ne pouvant aller qu'en avant (y=1),
    // on multiplie le mouvement par -1 pour le joueur du haut
    const sideMult: number =
      this.state.whoseTurn === 0 ? this.state.whiteSide : -this.state.whiteSide;

    /**
     * on parcours chaque piece du joueur en cours
     */
    this.state.pieces.forEach((piece: PieceState) => {
      if (!piece || piece.color !== this.state.whoseTurn) return;
      const pieceType: PieceType = getPieceType(piece.type);
      const possibleDest: Square[] = [];
      const mandatoryDest: Square[] = [];

      let x: number = 0;
      let y: number = 0;
      let repeat: number = 0;
      let hypothetic: Square = null;
      const from: Square = this.getSquare(piece.x, piece.y);

      /**
       * pour chaque piece on teste tous ses mouvements
       * et on ne retient que les possibles
       */
      pieceType.movements.forEach((movement: Movement) => {
        repeat = 0;
        hypothetic = from;
        // tant que le mouvement peut être répété
        while (repeat < movement.repeat) {
          x = hypothetic.x + movement.x * sideMult;
          y = hypothetic.y + movement.y * sideMult;
          hypothetic = this.getSquare(x, y);
          if (
            // si la case existe
            hypothetic &&
            // et qu'elle est vide ou occupée par un ennemi
            (hypothetic.piece === null ||
              hypothetic.piece.color !== piece.color) &&
            // et que la condition du movement est remplie
            (movement.condition === null ||
              movement.condition(
                movement,
                from,
                hypothetic,
                piece,
                this,
                repeat
              ))
          ) {
            testCheck({
              king: this.currentKing,
              pieces: this.state.pieces.reduce<PieceState[]>(
                (acc: PieceState[], p: PieceState): PieceState[] => {
                  if (p === piece) {
                    acc.push({
                      type: p.type,
                      color: p.color,
                      x: hypothetic.x,
                      y: hypothetic.y,
                    });
                  } else if (p !== hypothetic.piece) {
                    // on retire de la liste la piece tuée
                    acc.push(p);
                  }
                  return acc;
                },
                []
              ),
            });

            if (hypothetic.piece) {
              // case occupée par un ennemi, mouvement obligatoire
              mandatoryDest.push(hypothetic);
              return;
            }
            // case libre
            possibleDest.push(hypothetic);
            // on continue de chercher si ce mouvement est répétable
            repeat++;
          } else {
            // si la case n'existe pas
            // ou est occupée par un allié
            // ou la condition du mouvement ne permet pas d'y aller
            return;
          }
        }
      });

      if (mandatoryDest.length) {
        // si cette case a des mouvements obligatoires, on les enregistre
        this.mandatoryMoves.push({
          from: from,
          to: mandatoryDest,
        });
      } else if (possibleDest.length) {
        // si elle n'a pas de mouvement obligatoire, on enregistre les mouvements possibles
        this.possibleMoves.push({
          from: from,
          to: possibleDest,
        });
      }
    });
  }
}

function isMoveInList(
  x: number,
  y: number,
  toX: number,
  toY: number,
  list: MovesList[]
): boolean {
  return list.some((moves: MovesList) => {
    if (moves.from.x === x && moves.from.y === y) {
      return moves.to.some(dest => {
        return dest.x === toX && dest.y === toY;
      });
    }
    return false;
  });
}

function flatMovesList(list: MovesList[]): FlatMovesList {
  const out: FlatMovesList = [];
  list.forEach(moves => {
    moves.to.forEach(dest =>
      out.push({ x: moves.from.x, y: moves.from.y, toX: dest.x, toY: dest.y })
    );
  });
  return out;
}

/**
 * test if the king can be killed by an opponent
 * @param state
 */
export function testCheck(state: {
  king: { x: number; y: number };
  pieces: PieceState[];
}): boolean {
  return false;
}
