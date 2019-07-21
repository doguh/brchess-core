const Piece = require('./Piece');
const Side = require('../Side');
const Movement = require('../Movement');
const { create: makeMove } = require('../Movement');

const specialMoveCondition = (pawn, position, movement) => {
  const piece = pawn.board.getPieceAt(position);
  return Boolean(piece && piece.player.color !== pawn.player.color);
};

const conditionEmpty = (pawn, position, movement) => {
  return !pawn.board.getPieceAt(position);
};

const conditionFirstMove = (pawn, position, movement) => {
  return (
    pawn.moveCount === 0 &&
    !pawn.board.getPieceAt(position) &&
    !pawn.board.getPieceAt({
      file: pawn.position.file,
      rank: pawn.position.rank + movement.rank / 2,
    }) // hmm un peu trop hacky...
  );
};

const bottomSideMovements = [
  makeMove(0, 1, 0, conditionEmpty),
  makeMove(0, 2, 0, conditionFirstMove),
  makeMove(1, 1, 0, specialMoveCondition),
  makeMove(-1, 1, 0, specialMoveCondition),
];

const topSideMovements = [
  makeMove(0, -1, 0, conditionEmpty),
  makeMove(0, -2, 0, conditionFirstMove),
  makeMove(1, -1, 0, specialMoveCondition),
  makeMove(-1, -1, 0, specialMoveCondition),
];

class Pawn extends Piece {
  constructor(positon, board, player) {
    super(
      Piece.TYPE_PAWN,
      positon,
      board,
      player,
      player.side === Side.BOTTOM ? bottomSideMovements : topSideMovements
    );
  }
}

module.exports = Pawn;
