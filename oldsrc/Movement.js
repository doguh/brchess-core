class Movement {
  static create(file, rank, repeat = 0, condition = null) {
    return new Movement(file, rank, repeat, condition);
  }

  constructor(file, rank, repeat = 0, condition = null) {
    this.file = file;
    this.rank = rank;
    this.repeat = repeat;
    this.condition = condition;
  }
}

module.exports = Movement;
