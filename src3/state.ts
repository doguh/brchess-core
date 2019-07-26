import { BoardState, Color } from './types';
import { White, Black } from './constantes';

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
        type: 'r',
        x: 0,
        y: 0,
        color: botColor,
      },
      {
        type: 'n',
        x: 1,
        y: 0,
        color: botColor,
      },
      {
        type: 'b',
        x: 2,
        y: 0,
        color: botColor,
      },
      {
        type: botColor === White ? 'k' : 'q',
        x: 3,
        y: 0,
        color: botColor,
      },
      {
        type: botColor === White ? 'q' : 'k',
        x: 4,
        y: 0,
        color: botColor,
      },
      {
        type: 'b',
        x: 5,
        y: 0,
        color: botColor,
      },
      {
        type: 'n',
        x: 6,
        y: 0,
        color: botColor,
      },
      {
        type: 'r',
        x: 7,
        y: 0,
        color: botColor,
      },
      /**
       * top
       */
      {
        type: 'r',
        x: 0,
        y: 7,
        color: topColor,
      },
      {
        type: 'n',
        x: 1,
        y: 7,
        color: topColor,
      },
      {
        type: 'b',
        x: 2,
        y: 7,
        color: topColor,
      },
      {
        type: botColor === White ? 'k' : 'q',
        x: 3,
        y: 7,
        color: topColor,
      },
      {
        type: botColor === White ? 'q' : 'k',
        x: 4,
        y: 7,
        color: topColor,
      },
      {
        type: 'b',
        x: 5,
        y: 7,
        color: topColor,
      },
      {
        type: 'n',
        x: 6,
        y: 7,
        color: topColor,
      },
      {
        type: 'r',
        x: 7,
        y: 7,
        color: topColor,
      },
    ],
  };
}
