const Board = require('./Board');
const Position = require('./Position');
const pos = Position.fromString;

const board = new Board();

board.print();

board.move(pos('d2'), pos('d4'));
board.print();

board.move(pos('c7'), pos('c5'));
board.print();

board.move(pos('d4'), pos('c5'));
board.print();

console.log(
  board
    .getPieceAt(pos('d8'))
    .getValidMoves()
    .toString()
);
