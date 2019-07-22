import Board from './Board';
import getDefaultBoardState from './state';

const b = new Board(getDefaultBoardState());

console.log(b);

console.log(b.getSquare(4, 0));
