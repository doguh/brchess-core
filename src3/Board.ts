import {
  BoardState,
  Square,
  Color,
  PieceState,
  MovesList,
  PieceType,
  Movement,
  FlatMovesList,
  Side,
} from './types';
import { getPieceType } from './pieces';
import { StateHistory } from 'state-history';

const WIDTH = 8;
const HEIGHT = 8;

export default class Board {
  private state: BoardState;
  private squares: Square[];
  private possibleMoves: MovesList[];
  private mandatoryMoves: MovesList[];
  private currentKing: PieceState;
  private ennemyKing: PieceState;
  private _isCheck: boolean = false;
  private _isCheckMate: boolean = false;
  private _isPat: boolean = false;
  private _history: StateHistory<BoardState>;

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

    this._history = new StateHistory<BoardState>();
    this._history.subscribe(this.onStateChange);

    if (state) {
      this.setState(state);
    }
  }

  get isCheck(): boolean {
    return this._isCheck;
  }

  get isCheckMate(): boolean {
    return this._isCheckMate;
  }

  get isPat(): boolean {
    return this._isPat;
  }

  get history(): StateHistory<BoardState> {
    return this._history;
  }

  setState(nextState: BoardState) {
    this._history.push(nextState);
  }

  private onStateChange = (nextState: BoardState) => {
    console.log('setState');
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
  };

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
    console.log('move', { x, y, toX, toY });
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

    const legalMoves = this.mandatoryMoves.length
      ? this.mandatoryMoves
      : this.possibleMoves;
    if (!isMoveInList(x, y, toX, toY, legalMoves)) {
      throw new Error('Illegal move');
    }

    // si il y a une piece sur la case d'arrivée, elle est tuée
    const killed: PieceState = this.getPiece(toX, toY);

    // TODO maybe dispatch move and kill events

    this.setState({
      whiteSide: this.state.whiteSide,
      whoseTurn: ((this.state.whoseTurn + 1) % 2) as Color,
      pieces: reducePieces(this.state.pieces, piece, toX, toY, killed),
    });
  }

  getLegalMoves(): MovesList[] {
    const legalMoves: MovesList[] = this.mandatoryMoves.length
      ? this.mandatoryMoves
      : this.possibleMoves;
    // clone moves to be sure user dont mutate them
    return legalMoves.map(m => ({ ...m }));
  }

  getLegalMovesFlat(): FlatMovesList {
    return this.mandatoryMoves.length
      ? flatMovesList(this.mandatoryMoves)
      : flatMovesList(this.possibleMoves);
  }

  private invalidatePossibleMoves(): void {
    console.log('invalidate possible moves');
    // multiplicateur des mouvements selon le côté du joueur (1 ou -1):
    // les pions ne pouvant aller qu'en avant (y=1),
    // on multiplie le mouvement par -1 pour le joueur du haut
    const sideMult: number =
      this.state.whoseTurn === 0 ? this.state.whiteSide : -this.state.whiteSide;

    this._isCheck = testCheck({
      king: this.currentKing,
      pieces: this.state.pieces,
      whiteSide: this.state.whiteSide,
    });
    // TODO maybe dispatch an event if check

    this.possibleMoves = [];
    this.mandatoryMoves = [];

    /**
     * on parcours chaque piece du joueur en cours
     */
    this.state.pieces.forEach((piece: PieceState) => {
      if (!piece || piece.color !== this.state.whoseTurn) return;
      const pieceType: PieceType = getPieceType(piece.type);
      const possibleDest: Square[] = [];
      const mandatoryDest: Square[] = [];
      const from: Square = this.getSquare(piece.x, piece.y);

      /**
       * pour chaque piece on teste tous ses mouvements
       * et on ne retient que les possibles
       */
      pieceType.movements.forEach(movement =>
        findPossibleDestinations(
          piece,
          movement,
          from,
          sideMult as Side,
          this.getSquare.bind(this),
          (hypothetic: Square): void => {
            /**
             * test if the king will be checked after this move
             */
            const willCheck: boolean = testCheck({
              king: this.currentKing,
              whiteSide: this.state.whiteSide,
              pieces: reducePieces(
                this.state.pieces,
                piece,
                hypothetic.x,
                hypothetic.y,
                hypothetic.piece
              ),
            });

            if (hypothetic.piece) {
              // case occupée par un ennemi, mouvement obligatoire
              if (!willCheck) mandatoryDest.push(hypothetic);
              return;
            }
            // case libre
            if (!willCheck) possibleDest.push(hypothetic);
          }
        )
      );

      if (mandatoryDest.length) {
        // si cette pièce a des mouvements obligatoires, on les enregistre
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

    const noLegalMove: boolean =
      this.mandatoryMoves.length === 0 && this.possibleMoves.length === 0;
    this._isCheckMate = noLegalMove && this._isCheck;
    this._isPat = noLegalMove && !this._isCheck;
    // TODO maybe dispatch an event if checkMate or pat
  }

  destroy(): void {
    this._history.unsubscribe(this.onStateChange);
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
 * retourne une copie du tableau `pieces`
 * en créant un nouvel objet à la place de `piece`
 * avec `x` et `y` mis à jour et en supprimant `remove` du tableau
 * @param pieces
 * @param piece
 * @param newX
 * @param newY
 * @param remove
 */
function reducePieces(
  pieces: PieceState[],
  piece: PieceState,
  newX: number,
  newY: number,
  remove: PieceState = null
): PieceState[] {
  return pieces.reduce<PieceState[]>(
    (acc: PieceState[], p: PieceState): PieceState[] => {
      if (p === piece) {
        // si c'est la piece dont il faut modifier la position
        acc.push({
          type: p.type,
          color: p.color,
          x: newX,
          y: newY,
        });
      } else if (p !== remove) {
        // on retire de la liste la piece tuée
        acc.push(p);
      }
      return acc;
    },
    []
  );
}

/**
 * used to create a virtual board for check test
 * @param squares
 * @param x
 * @param y
 */
function getOrCreateSquare(squares: Square[], x: number, y: number): Square {
  if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) {
    return null;
  }
  return (
    squares[x + y * WIDTH] ||
    (squares[x + y * WIDTH] = {
      x,
      y,
      piece: null,
      color: null,
    })
  );
}

/**
 * test if the king can be killed by an opponent
 * @param state
 */
export function testCheck(state: {
  king: PieceState;
  pieces: PieceState[];
  whiteSide: Side;
}): boolean {
  const squares: Square[] = [];
  const { king, pieces, whiteSide } = state;
  const sideMult: Side = (king.color === 0 ? -whiteSide : whiteSide) as Side;
  const getSquare = (x: number, y: number) => getOrCreateSquare(squares, x, y);
  const what = pieces
    .filter((piece, i) => {
      getOrCreateSquare(squares, piece.x, piece.y).piece = piece;
      return piece.color !== king.color;
    })
    .some(piece => {
      // apply piece movements
      const pieceType: PieceType = getPieceType(piece.type);
      const from: Square = getOrCreateSquare(squares, piece.x, piece.y);
      return pieceType.movements.some(movement =>
        findPossibleDestinations(
          piece,
          movement,
          from,
          sideMult,
          getSquare,
          (hypothetic: Square): true | void => {
            if (hypothetic.piece && hypothetic.piece === king) {
              return true;
            }
          }
        )
      );
    });
  return what;
}

/**
 * appelle `callback` sur chaque case où ce mouvement permet d'aller
 *
 * si `callback` retourne autre chose que `undefined`,
 * cette fonction s'arrête de tenter de répeter le mouvement et retourne
 * la valeur retournée par `callback`
 *
 * @param piece
 * @param movement
 * @param from
 * @param sideMult
 * @param getSquare
 * @param callback
 */
function findPossibleDestinations(
  piece: PieceState,
  movement: Movement,
  from: Square,
  sideMult: Side,
  getSquare: (x: number, y: number) => Square,
  callback: (square: Square) => any
): any {
  let repeat: number = 0;
  let hypothetic: Square = from;
  let x: number;
  let y: number;
  // tant que le mouvement peut être répété
  while (repeat < movement.repeat) {
    x = hypothetic.x + movement.x * sideMult;
    y = hypothetic.y + movement.y * sideMult;
    hypothetic = getSquare(x, y);
    if (
      // si la case existe
      hypothetic &&
      // et qu'elle est vide ou occupée par un ennemi
      (hypothetic.piece === null || hypothetic.piece.color !== piece.color) &&
      // et que la condition du movement est remplie
      (movement.condition === null ||
        movement.condition(from, hypothetic, repeat, getSquare))
    ) {
      const r = callback(hypothetic);
      if (r !== undefined) return r;
      if (hypothetic.piece) {
        // si case occupée, on quitte car on ne pourra pas aller plus loin
        return;
      }
      // la case est libre, on repete pour trouver des cases libres plus loin
      repeat++;
    } else {
      // si la case n'existe pas
      // ou est occupée par un allié
      // ou la condition du mouvement ne permet pas d'y aller
      return;
    }
  }
}
