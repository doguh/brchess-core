import Board from './Board';
import Square from './Square';

const board: Board = new Board();

const square: Square = board.getSquare(4, 0);

console.log('square :', square);

const moves: Square[] = square.piece.getValidMoves();
console.log('valid moves :', moves, 'total :', moves.length);
