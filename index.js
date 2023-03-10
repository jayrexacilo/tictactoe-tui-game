console.clear(); // clear terminal on run

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const cells = ['_31', '_32', '_33', '_21', '_22', '_23', '_11', '_12', '_13'];
const layout = `
  _____________
3 |_31|_32|_33|
  -------------
2 |_21|_22|_23|
  -------------
1 |_11|_12|_13|
  -------------
0  _1  _2  _3
`;
const emptyLayout = layout.replace(/_[\d][\d]/gm, '   ');
const winningMoves = [
  [31, 32, 33],
  [21, 22, 23],
  [11, 12, 13],
  [11, 22, 33],
  [13, 22, 31],
  [31, 21, 11],
  [32, 22, 12],
  [33, 23, 13]
];

let displayLayout = emptyLayout;
let movesLeft = cells;
let xMoves = [];
let oMoves = [];
let standings = {
  X: 0,
  O: 0
};

console.log(displayLayout);

function main(rerun) {
  readline.question('X: your move? ', move => {
    console.clear();
    if(!isValidMove(move)) return;

    const _move = '_'+move;
    xMoves.push(_move);
    displayLayout = layout.replace(_move, ' X ');

    removeMovesLeftOnMove(xMoves);
    updateLayout(xMoves, 'X');
    randomOMoves();
    removeMovesLeftOnMove(oMoves);
    updateLayout(movesLeft, ' ');
    updateLayout(oMoves, 'O');

    console.log(displayLayout);

    processGame();
    rerun(rerun);
  });
}

main(main);

const reset = () => {
  displayLayout = emptyLayout;
  movesLeft = cells;
  xMoves = [];
  oMoves = [];

};
const playAgainQ = () => {
  readline.question('Play again? Y/n  ', ans => {
    if(ans === 'n') return readline.close();
    console.clear();
    console.log(displayLayout);
    main(main);
  });
};
const showStandings = () => {
  console.log("STANDINGS: ");
  console.log("X: ", standings.X);
  console.log("O: ", standings.O);
};
const winner = who => {
  console.clear();
  console.log(displayLayout);
  console.log('->  '+who+'  <- WON THE GAME!!!!\n');
  reset();
  standings[who] += 1;
  showStandings();
  playAgainQ();
};
const verifyMoves = (who) => {
  return winningMoves.map(item => {
    const isEmpty = item.filter(i => !who.includes('_'+i)).length === 0;
    return isEmpty ? 'yes' : 'no';
  }).filter(item => item === 'yes').length;
};
const processGame = () => {
  if(xMoves.length > 2 || oMoves.length > 2) {
    if(verifyMoves(xMoves)) {
      winner('X');
      return;
    }
    if(verifyMoves(oMoves)) {
      winner('O');
      return;
    }
    if(movesLeft.length < 1) {
      console.clear();
      console.log(displayLayout);
      console.log("\nIT's A DRAW!!!!");
      showStandings();
      reset();
      playAgainQ();
      return;
    }
  }
};
const isValidMove = (move) => {
  if(!movesLeft.includes('_'+move)) {
    console.log('\n' + move + ' IS INVALID MOVE!!');
    console.log('\nAvailable move(s) => ', movesLeft.map(item => +item.replace('_', '')));
    console.log(displayLayout);
    main(main);
    return false;
  }
  return true;
};
const removeMovesLeftOnMove = who => {
  movesLeft = movesLeft.filter(item => !who.includes(item));
};
const updateLayout = (who, type) => {
  for(let i=0; i<who.length;i++) {
    displayLayout = displayLayout.replace(who[i], ` ${type} `);
  }
};
const randomOMoves = () => {
  const randomIndex = Math.floor(Math.random() * (movesLeft.length - 1) + 1);
  oMoves.push(movesLeft[randomIndex]);
};
