import { Component } from "./interfaces";

export type PieceState = {
  type: string;
  x: number;
  y: number;
  moveCount: number;
  dead: boolean;
};

export type ComponentsList = {
  [key: string]: Component;
};

export type PieceStateList = {
  [key: string]: PieceState;
};

export type Team = {
  color: string;
  side: "bottom" | "top";
};

export type PlayerState = {
  team: Team;
  pieces: PieceStateList;
};

export type BoardState = {
  turn: number;
  currentPlayer: string;
  player1: PlayerState;
  player2: PlayerState;
};

export type ComponentUpdate = {
  component: any; // typeof <? extends Component> # mais ça a l'air impossible à faire...
  props: any;
};

export type ComponentUpdateList = {
  [key: string]: ComponentUpdate;
};
