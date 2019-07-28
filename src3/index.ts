export { default as Board, testCheck } from './Board';
export { default as getDefaultBoardState, getRandomBoardState } from './state';
export {
  registerPieceType,
  getPieceType,
  King,
  Queen,
  Bishop,
  Knight,
  Rook,
  Pawn,
} from './pieces';
export { White, Black, WIDTH, HEIGHT } from './constantes';
