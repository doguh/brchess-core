import Board from './Board';
import { Color, BoardState, PieceType, PieceState } from './types';
import { King, Pawn, types } from './pieces';
import { HEIGHT, White } from './constantes';

const virtualBoard: Board = new Board();
virtualBoard.history.maxLength = 0;

export default class AI {
  private board: Board;
  private color: Color;
  private delay: number;
  private actionTimeout: number;

  constructor(board: Board, color: Color, delay: number = 0) {
    this.board = board;
    this.color = color;
    this.delay = delay;
    this.board.history.subscribe(this.onHistoryChange);
    const state = this.board.getState();
    if (state) this.onHistoryChange(state);
  }

  private onHistoryChange = (state: BoardState) => {
    if (!this.board.mustBePromoted && state.whoseTurn === this.color) {
      // si c'est à l'IA de jouer
      this.move(state);
    } else if (
      this.board.mustBePromoted &&
      this.board.mustBePromoted.color === this.color
    ) {
      // si l'IA doit promouvoir un pion
      this.promote(state);
    }
  };

  private move(state: BoardState) {
    console.log('AI find best move...');
    let numPieces: number = 0;
    let numEnnemies: number = 0;
    state.pieces.forEach(piece => {
      if (piece.color === this.color) {
        numPieces++;
      } else {
        numEnnemies++;
      }
    });

    const moves = this.board.getLegalMovesFlat();
    let bestMove: {
      x: number;
      y: number;
      toX: number;
      toY: number;
    } = null;
    let bestScore = -Infinity;

    moves.forEach(move => {
      virtualBoard.setState(state);
      const piece = virtualBoard.getPiece(move.x, move.y);
      virtualBoard.move(move.x, move.y, move.toX, move.toY);
      const ennemyMoves = virtualBoard.getLegalMovesFlat();
      const mustKill =
        ennemyMoves.length &&
        !!virtualBoard.getPiece(ennemyMoves[0].toX, ennemyMoves[0].toY);

      let score: number = 100;
      if (mustKill) {
        score += 100;
      }
      if (numEnnemies > 6) {
        score -= ennemyMoves.length;
      }
      if (numPieces <= 6 && piece.type === King.key) {
        score -= 50;
      }
      if (piece.type === Pawn.key) {
        score += piece.color === White ? piece.y : HEIGHT - piece.y - 1;
      }

      const newState = virtualBoard.getState();
      let willNeedToKill: boolean = false;
      let minNumPossibleMoves: number = Infinity;
      ennemyMoves.forEach(move => {
        virtualBoard.setState(newState);
        virtualBoard.move(move.x, move.y, move.toX, move.toY);
        if (virtualBoard.mustBePromoted) {
          virtualBoard.promote();
        }
        const possibleMoves = virtualBoard.getLegalMovesFlat();
        if (possibleMoves.length < minNumPossibleMoves) {
          minNumPossibleMoves = possibleMoves.length;
        }
        willNeedToKill = possibleMoves.some(myMove => {
          if (virtualBoard.getPiece(myMove.toX, myMove.toY)) {
            return true;
          }
        });
      });

      score += minNumPossibleMoves;
      if (willNeedToKill) {
        score -= 50;
      }

      if (score >= bestScore) {
        bestMove = move;
        bestScore = score;
      }
    });
    if (bestMove) {
      this.delayAction(() =>
        this.board.move(bestMove.x, bestMove.y, bestMove.toX, bestMove.toY)
      );
    }
    console.log('AI found best move:', bestMove, bestScore);
  }

  private promote(state: BoardState) {
    console.log('AI find best promote');
    const toPromote: PieceState = this.board.mustBePromoted;
    let bestType: PieceType;
    let bestScore: number = -Infinity;

    Object.keys(types).forEach(key => {
      const type: PieceType = types[key];
      if (type.canPromote) {
        let score = 100;

        virtualBoard.setState(state);
        virtualBoard.promote(type);
        const newState = virtualBoard.getState();

        const ennemyMoves = virtualBoard.getLegalMovesFlat();

        let willNeedToKill: boolean = false;
        let minNumPossibleMoves: number = Infinity;
        ennemyMoves.forEach(move => {
          virtualBoard.setState(newState);
          virtualBoard.move(move.x, move.y, move.toX, move.toY);
          if (virtualBoard.mustBePromoted) {
            virtualBoard.promote();
          }
          const possibleMoves = virtualBoard.getLegalMovesFlat();
          if (possibleMoves.length < minNumPossibleMoves) {
            minNumPossibleMoves = possibleMoves.length;
          }
          possibleMoves.forEach(myMove => {
            if (
              myMove.x === toPromote.x &&
              myMove.y === toPromote.y &&
              virtualBoard.getPiece(myMove.toX, myMove.toY)
            ) {
              willNeedToKill = true;
            }
          });
        });

        score += minNumPossibleMoves;

        if (willNeedToKill) {
          score -= 50;
        }

        if (score > bestScore) {
          bestScore = score;
          bestType = type;
        }
      }
    });

    console.log('AI found best promote:', bestType.key, bestScore);

    this.board.promote(bestType);
  }

  private delayAction(fn: () => any) {
    clearTimeout(this.actionTimeout);
    this.actionTimeout = setTimeout(fn, this.delay);
  }

  destroy() {
    clearTimeout(this.actionTimeout);
    this.board.history.unsubscribe(this.onHistoryChange);
    this.board = null;
  }
}
