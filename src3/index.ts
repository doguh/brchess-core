import Board from './Board';
import getDefaultBoardState from './state';

let t = Date.now();

const b = new Board(getDefaultBoardState());

// console.log(b);

// console.log(b.getSquare(4, 0));
// console.log(b.getSquare(4, 7));

let mandatoryMoves = b.getLegalMovesFlat();
console.log('mandatory moves:', mandatoryMoves);

b.move(4, 0, 4, 7);

mandatoryMoves = b.getLegalMovesFlat();
console.log('mandatory moves:', b.getLegalMovesFlat());

b.move(
  mandatoryMoves[0].x,
  mandatoryMoves[0].y,
  mandatoryMoves[0].toX,
  mandatoryMoves[0].toY
);

mandatoryMoves = b.getLegalMovesFlat();
console.log('mandatory moves:', b.getLegalMovesFlat());

// console.log(b.getSquare(4, 0));
// console.log(b.getSquare(4, 7));

// console.log(b);

// console.log(b.getSquare(5, 7));
// console.log(b.getSquare(7, 7));

console.log(Date.now() - t + 'ms');
