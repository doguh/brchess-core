export type PieceState = {
  type: string;
  x: number;
  y: number;
  moveCount: number;
  dead: boolean;
};

// export type PieceListState = {
//   [key: string]: PieceState;
// };

// export type PieceListState = Record<string, PieceState>;

export type Team = {
  color: string;
  side: 'bottom' | 'top';
};

export type PlayerState = {
  team: Team;
  pieces: PieceState[];
};

export type BoardState = {
  turn: number;
  currentPlayer: string;
  player1: PlayerState;
  player2: PlayerState;
};
