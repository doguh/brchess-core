import Board from './Board';
import Square from './Square';

const board: Board = new Board();

const square: Square = board.getSquare(4, 0);

console.log('square :', square);

const moves: Square[] = square.piece.getValidMoves();
console.log('valid moves :', moves, 'total :', moves.length);

console.log('enemy moves: ', board.getSquare(4, 7).piece.getValidMoves());

console.log('pawn moves: ', board.getSquare(4, 1).piece.getValidMoves());

console.log(board.getState());
