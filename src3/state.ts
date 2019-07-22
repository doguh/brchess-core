import { BoardState, Side, Color } from './types';

export default function getDefaultBoardState(whiteSide: Side): BoardState {
  const botColor: Color = whiteSide === 1 ? 0 : 1;
  const topColor: Color = whiteSide === 1 ? 1 : 0;
  return {
    whiteSide,
    whoseTurn: 0,
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
        type: 'q',
        x: 3,
        y: 0,
        color: botColor,
      },
      {
        type: 'k',
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
        type: 'q',
        x: 3,
        y: 7,
        color: topColor,
      },
      {
        type: 'k',
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