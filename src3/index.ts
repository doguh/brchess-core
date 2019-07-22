import Board from './Board';
import getDefaultBoardState from './state';

const b = new Board(getDefaultBoardState());

console.log(b.getSquare(4, 0));
console.log(b.getSquare(4, 7));

console.log('mandatory moves:', b.getMandatoryMoves());

console.log('move!');
b.move(4, 0, 4, 7);

console.log(b.getSquare(4, 0));
console.log(b.getSquare(4, 7));
