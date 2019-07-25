import { BoardState, Side, Color } from './types';
import { White, Black, Bottom } from './constantes';

export default function getDefaultBoardState(
  whiteSide: Side = Bottom
): BoardState {
  const botColor: Color = whiteSide === Bottom ? White : Black;
  const topColor: Color = whiteSide === Bottom ? Black : White;
  return {
    whiteSide,
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
        type: whiteSide === 1 ? 'k' : 'q',
        x: 3,
        y: 0,
        color: botColor,
      },
      {
        type: whiteSide === 1 ? 'q' : 'k',
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
        type: whiteSide === 1 ? 'k' : 'q',
        x: 3,
        y: 7,
        color: topColor,
      },
      {
        type: whiteSide === 1 ? 'q' : 'k',
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
