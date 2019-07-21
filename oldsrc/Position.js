const Board = require('./Board');

class Position {
  static fromString(position) {
    return new Position(
      position.toLowerCase().charCodeAt(0) - 96,
      parseInt(position.charAt(1), 10)
    );
  }

  constructor(file, rank) {
    this.file = file; // column (x)
    this.rank = rank; // row (y)
  }

  toString() {
    return String.fromCharCode(this.file + 96) + this.rank;
  }

  equals(position) {
    return this.rank === position.rank && this.file === position.file;
  }

  applyMovement(movement) {
    this.file += movement.file;
    this.rank += movement.rank;
    return this;
  }

  clone() {
    return new Position(this.file, this.rank);
  }

  copy(position) {
    this.file = position.file;
    this.rank = position.rank;
    return this;
  }
}

module.exports = Position;
