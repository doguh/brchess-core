import {
  PlayerState,
  PieceState,
  BoardState,
  ComponentUpdateList,
  ComponentUpdate
} from "./types";

export interface IComponent {
  state: any;
  props: any;
  /**
   * called inside the constructor just before the `update` method
   * is called for the first time
   * @param options contructor's `initOptions`
   */
  onMount(options: any): void;
  /**
   * called just before the component receives new props
   * (also called on first time, if `initialProps` are not `null`)
   * @param newProps new props
   * @param oldProps old props
   */
  onReceiveProps(newProps: any, oldProps: any): void;
  /**
   * called right before the component is destroyed
   */
  onUnmount(): void;
  /**
   * can only be called from within the component itself
   * @param state new state
   */
  setState(state: any): void;
  /**
   * called when the `state` or the `props` have changed,
   * it should be overriden in subclasses but never called manually
   *
   * it should return an iteratable object of updates to apply to the children components
   *
   * @example
   * update(state) {
   *   return {
   *     key: { component: CustomComponentClass, props: state.myComponentProps }
   *   }
   * }
   *
   * @param state new state
   * @param props new props
   * @returns {ComponentUpdateList} a list of updates that should be applied to the children components
   */
  update(state: any, props: any): ComponentUpdateList;
}

export interface ISquare {
  x: number;
  y: number;
  color: string;
  piece: Piece;
  file: string;
  rank: string;
  name: string;
}

export class Square implements ISquare {
  x: number;
  y: number;
  color: string;
  piece: Piece; // attention à cette référence non destroyed!

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  get file(): string {
    return String.fromCharCode(this.x + 97);
  }
  get rank(): string {
    return `${this.y + 1}`;
  }
  get name(): string {
    return this.file + this.rank;
  }
}

function each<T>(
  obj: Object,
  cb: (value: T, key: string, obj: Object) => void
) {
  Object.keys(obj).forEach(key => cb(obj[key], key, obj));
}

export class Component implements IComponent {
  state: any;
  props: any;
  private updating: boolean;
  private components: { [key: string]: Component } = {};

  constructor(initialProps: any = null, initOptions: any = null) {
    this.updating = true;
    this.setProps(initialProps);
    this.onMount(initOptions);
    this.internalUpdate();
    this.updating = false;
  }

  onMount(options: any): void {}

  private internalUpdate(): void {
    const us: ComponentUpdateList = this.update(this.state, this.props);
    // loop through existing components, and remove those which are not in the new list
    each(this.components, (c: Component, key: string) => {
      if (!us || !us[key]) {
        c.destroy();
        delete this.components[key];
      }
    });
    // loop through the new list and create/update the components
    if (us) {
      each(us, (u: ComponentUpdate, key: string) => {
        if (!this.components[key]) {
          this.components[key] = new u.component(u.props);
        } else {
          this.components[key].setProps(u.props);
        }
      });
    }
  }

  onReceiveProps(newProps: any, oldProps: any): void {}

  onUnmount(): void {}

  private setProps(props: any): void {
    if (!props || props === this.props) {
      // implements shallow equals here too
      return;
    }
    const callUpdate: boolean = !this.updating;
    this.updating = true;
    this.onReceiveProps(props, this.props);
    this.props = props;
    if (callUpdate) {
      this.internalUpdate();
      this.updating = false;
    }
  }

  setState(state: any): void {
    this.state = state;
    if (!this.updating) this.internalUpdate();
  }

  update(state: any, props: any): ComponentUpdateList {
    return null;
  }

  private destroy(): void {
    each(this.components, (c: Component) => c.destroy());
    this.onUnmount();
    this.components = null;
    this.state = null;
    this.props = null;
  }
}

const WIDTH: number = 8;
const HEIGHT: number = 8;

export class Board extends Component {
  state: BoardState;
  props: BoardState;
  squares: Square[];

  getSquareAt(x: number, y: number): Square {
    // TODO
    return null;
  }

  onMount(): void {
    const len = WIDTH * HEIGHT;
    let x: number;
    let y: number;
    let color: string;

    this.squares = [];
    for (let i: number = 0; i < len; i++) {
      x = i % WIDTH;
      x === 0 && i > 0 && y++;
      color = x % 2 === y % 2 ? "black" : "white";
      this.squares[i] = new Square(x, y, color);
    }
  }

  onReceiveProps(newProps: BoardState): void {
    // map props to state
    this.setState(newProps);
  }

  update(state: any, props: BoardState): ComponentUpdateList {
    return {
      player1: { component: Player, props: state.player1 },
      player2: { component: Player, props: state.player2 }
    };
  }

  onUnmount(): void {
    if (this.squares) this.squares.forEach(square => (square.piece = null));
    this.squares = null;
  }
}

export class Player extends Component {
  props: PlayerState;
  board: Board;

  constructor(initialProps: PlayerState, board: Board) {
    super(initialProps);
    this.board = board;
  }

  update(state: any, props: PlayerState): ComponentUpdateList {
    return {
      ...Object.keys(props.pieces).reduce(
        (acc: ComponentUpdateList, key: string): ComponentUpdateList => {
          acc.key = {
            component: Piece,
            props: props.pieces[key]
          };
          return acc;
        },
        {}
      )
    };
  }

  onUnmount(): void {
    this.board = null;
  }
}

export class Piece extends Component {
  props: PieceState;
  player: Player;

  constructor(initialProps: PieceState, player: Player) {
    super(initialProps);
    this.player = player;
  }

  get square(): Square {
    return this.player.board.getSquareAt(this.props.x, this.props.y);
  }

  onReceiveProps(newProps: PieceState, oldProps: PieceState): void {
    if (!oldProps || newProps.x !== oldProps.x || newProps.y !== oldProps.y) {
      if (oldProps) {
        const oldSquare: Square = this.player.board.getSquareAt(
          oldProps.x,
          oldProps.y
        );
        if (oldSquare.piece === this) {
          oldSquare.piece = null;
        }
      }
      const newSquare: Square = this.player.board.getSquareAt(
        newProps.x,
        newProps.y
      );
      newSquare.piece = this;
    }
  }

  onUnmount(): void {
    if (this.props) {
      const square: Square = this.square;
      if (square && square.piece === this) {
        square.piece = null;
      }
    }
    this.player = null;
  }
}
