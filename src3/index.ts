import Board from './Board';
import getDefaultBoardState from './state';
import StateHistory from './StateHistory';

const h = new StateHistory();

h.push({ a: 1 });
h.push({ a: 2 });
h.push({ a: 3 });
h.push({ a: 4 });
h.push({ a: 5 });
h.push({ a: 6 });
h.push({ a: 7 });
h.push({ a: 8 });
h.push({ a: 9 });

h.go(-4);
console.log(h);

let t = Date.now();
for (let i = 0; i < 10000000; i++) {
  if (i % 2) h.goNext();
  else h.goPrev();
}
console.log('goPrev/goNext:', Date.now() - t + 'ms');

t = Date.now();
for (let i = 0; i < 10000000; i++) {
  if (i % 2) h.go(1);
  else h.go(-1);
}
console.log('go-1/go+1:', Date.now() - t + 'ms');

// h.goPrev();
// console.log(h);
// h.goPrev();
// console.log(h);
// h.goPrev();
// console.log(h);
// h.goNext();
// console.log(h);
// h.goNext();
// console.log(h);
// h.goLast();
// console.log(h);

// let t = Date.now();

// const b = new Board(getDefaultBoardState());

// // console.log(b);

// // console.log(b.getSquare(4, 0));
// // console.log(b.getSquare(4, 7));

// let mandatoryMoves = b.getLegalMovesFlat();
// console.log('mandatory moves:', mandatoryMoves);

// b.move(4, 0, 4, 7);

// mandatoryMoves = b.getLegalMovesFlat();
// console.log('mandatory moves:', b.getLegalMovesFlat());

// b.move(
//   mandatoryMoves[0].x,
//   mandatoryMoves[0].y,
//   mandatoryMoves[0].toX,
//   mandatoryMoves[0].toY
// );

// mandatoryMoves = b.getLegalMovesFlat();
// console.log('mandatory moves:', b.getLegalMovesFlat());

// // console.log(b.getSquare(4, 0));
// // console.log(b.getSquare(4, 7));

// // console.log(b);

// // console.log(b.getSquare(5, 7));
// // console.log(b.getSquare(7, 7));

// console.log('4,7:', b.getSquare(4, 7));
// console.log('go prev');
// b.history.goPrev();
// console.log('4,7:', b.getSquare(4, 7));
// console.log('go prev');
// b.history.goPrev();
// console.log('4,7:', b.getSquare(4, 7));

// console.log(Date.now() - t + 'ms');
