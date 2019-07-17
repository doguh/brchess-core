type Side = {
  /**
   * side's name
   */
  readonly name: string;
  /**
   * y movement multiplicator,
   * particularly usefull for pawns that can move only forward
   */
  readonly y: number;
  /**
   * x movement multiplicator
   */
  readonly x: number;
};

export const SideTop: Side = { name: 'top', y: -1, x: -1 };

export const SideBottom: Side = { name: 'bottom', y: 1, x: 1 };

export default Side;
