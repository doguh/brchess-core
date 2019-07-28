import { BoardState, Color, PieceState } from './types';
import { White, Black, WIDTH, HEIGHT } from './constantes';
import { King, Queen, Bishop, Knight, Rook, Pawn } from './pieces';

export default function getDefaultBoardState(): BoardState {
  const botColor: Color = White;
  const topColor: Color = Black;
  return {
    whoseTurn: White,
    pieces: [
      /**
       * bottom
       */
      {
        type: Rook.key,
        x: 0,
        y: 0,
        color: botColor,
      },
      {
        type: Knight.key,
        x: 1,
        y: 0,
        color: botColor,
      },
      {
        type: Bishop.key,
        x: 2,
        y: 0,
        color: botColor,
      },
      {
        type: botColor === White ? King.key : Queen.key,
        x: 3,
        y: 0,
        color: botColor,
      },
      {
        type: botColor === White ? Queen.key : King.key,
        x: 4,
        y: 0,
        color: botColor,
      },
      {
        type: Bishop.key,
        x: 5,
        y: 0,
        color: botColor,
      },
      {
        type: Knight.key,
        x: 6,
        y: 0,
        color: botColor,
      },
      {
        type: Rook.key,
        x: 7,
        y: 0,
        color: botColor,
      },
      {
        type: Pawn.key,
        x: 0,
        y: 1,
        color: botColor,
      },
      {
        type: Pawn.key,
        x: 1,
        y: 1,
        color: botColor,
      },
      {
        type: Pawn.key,
        x: 2,
        y: 1,
        color: botColor,
      },
      {
        type: Pawn.key,
        x: 3,
        y: 1,
        color: botColor,
      },
      {
        type: Pawn.key,
        x: 4,
        y: 1,
        color: botColor,
      },
      {
        type: Pawn.key,
        x: 5,
        y: 1,
        color: botColor,
      },
      {
        type: Pawn.key,
        x: 6,
        y: 1,
        color: botColor,
      },
      {
        type: Pawn.key,
        x: 7,
        y: 1,
        color: botColor,
      },
      /**
       * top
       */
      {
        type: Rook.key,
        x: 0,
        y: 7,
        color: topColor,
      },
      {
        type: Knight.key,
        x: 1,
        y: 7,
        color: topColor,
      },
      {
        type: Bishop.key,
        x: 2,
        y: 7,
        color: topColor,
      },
      {
        type: botColor === White ? King.key : Queen.key,
        x: 3,
        y: 7,
        color: topColor,
      },
      {
        type: botColor === White ? Queen.key : King.key,
        x: 4,
        y: 7,
        color: topColor,
      },
      {
        type: Bishop.key,
        x: 5,
        y: 7,
        color: topColor,
      },
      {
        type: Knight.key,
        x: 6,
        y: 7,
        color: topColor,
      },
      {
        type: Rook.key,
        x: 7,
        y: 7,
        color: topColor,
      },
      {
        type: Pawn.key,
        x: 0,
        y: 6,
        color: topColor,
      },
      {
        type: Pawn.key,
        x: 1,
        y: 6,
        color: topColor,
      },
      {
        type: Pawn.key,
        x: 2,
        y: 6,
        color: topColor,
      },
      {
        type: Pawn.key,
        x: 3,
        y: 6,
        color: topColor,
      },
      {
        type: Pawn.key,
        x: 4,
        y: 6,
        color: topColor,
      },
      {
        type: Pawn.key,
        x: 5,
        y: 6,
        color: topColor,
      },
      {
        type: Pawn.key,
        x: 6,
        y: 6,
        color: topColor,
      },
      {
        type: Pawn.key,
        x: 7,
        y: 6,
        color: topColor,
      },
    ],
  };
}

export function getRandomBoardState(): BoardState {
  const state: BoardState = getDefaultBoardState();
  // on place les pieces aléatoirement
  state.pieces.forEach(piece => {
    const newPos = getRandomPos(piece);
    moveAndSwap(piece, newPos.x, newPos.y, state.pieces);
  });

  // on vérifie que les 2 fous d'un même joueur
  // ne sont pas sur une case de même couleur
  let whiteBishop: number = -1;
  let blackBishop: number = -1;
  state.pieces.forEach(piece => {
    if (piece.type === Bishop.key) {
      const color: number = piece.x % 2 === piece.y % 2 ? 0 : 1;
      const matesColor: number =
        piece.color === White ? whiteBishop : blackBishop;
      if (color === matesColor) {
        // les 2 fous sont sur une case de même couleur, on décale le 2e d'une case
        moveAndSwap(piece, (piece.x + 1) % WIDTH, piece.y, state.pieces);
      }
      if (piece.color === White) {
        whiteBishop = color;
      } else {
        blackBishop = color;
      }
    }
  });
  return state;
}

function moveAndSwap(
  piece: PieceState,
  x: number,
  y: number,
  pieces: PieceState[]
): void {
  const swap: PieceState = getPieceAt(pieces, x, y);
  if (swap) {
    swap.x = piece.x;
    swap.y = piece.y;
  }
  piece.x = x;
  piece.y = y;
}

function getPieceAt(pieces: any, x: number, y: number): PieceState {
  // pieces est de type any parce que TypeScript ne semble pas être au courant que Array.find existe depuis 150 ans
  return pieces.find((piece: PieceState) => piece.x === x && piece.y === y);
}

function getRandomPos(piece: PieceState): { x: number; y: number } {
  const out = {
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * 3),
  };
  if (piece.color === Black) {
    out.y = HEIGHT - 1 - out.y;
  }
  return out;
}
