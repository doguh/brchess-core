import Board from './Board';
import getDefaultBoardState from './state';

const b = new Board(getDefaultBoardState());

// console.log(b);

// console.log(b.getSquare(4, 0));
// console.log(b.getSquare(4, 7));

let mandatoryMoves = b.getMandatoryMoves();
console.log('mandatory moves:', mandatoryMoves);

b.move(4, 0, 4, 7);

mandatoryMoves = b.getMandatoryMoves();
console.log('mandatory moves:', b.getMandatoryMoves());

b.move(
  mandatoryMoves[0].x,
  mandatoryMoves[0].y,
  mandatoryMoves[0].toX,
  mandatoryMoves[0].toY
);

mandatoryMoves = b.getMandatoryMoves();
console.log('mandatory moves:', b.getMandatoryMoves());

// console.log(b.getSquare(4, 0));
// console.log(b.getSquare(4, 7));

// console.log(b);

// console.log(b.getSquare(5, 7));
// console.log(b.getSquare(7, 7));
