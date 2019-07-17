export type PieceState = {
  type: string;
  x: number;
  y: number;
};

export type PlayerState = {
  color: string;
  side: string;
  pieces: PieceState[];
};

export type BoardState = {
  turn: number;
  currentPlayer: string;
  player1: PlayerState;
  player2: PlayerState;
};
