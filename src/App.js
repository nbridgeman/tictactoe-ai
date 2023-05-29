import React, { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button 
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    }
    setSquares(nextSquares);
    setXIsNext(false);
  }

  function aiCanWin() {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] !== 'X' && squares[b] !== 'X' && squares[c] !== 'X') {
        if (squares[a] === 'O' && squares[b] === 'O') {
          return c;
        }
        if (squares[b] === 'O' && squares[c] === 'O') {
          return a;
        }
        if (squares[a] === 'O' && squares[c] === 'O') {
          return b;
        }
      }
    }
    return null;
  }

  function aiCanBlock() {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] !== 'O' && squares[b] !== 'O' && squares[c] !== 'O') {
        if (squares[a] === 'X' && squares[b] === 'X' && !squares[c]) {
          return c;
        }
        if (squares[b] === 'X' && squares[c] === 'X' && !squares[a]) {
          return a;
        }
        if (squares[a] === 'X' && squares[c] === 'X' && !squares[b]) {
          return b;
        }
      }
    }
    return null;
  }

  function aiCanBlockFork() {
    if (squares[0] === 'X' && squares[4] === 'O' && squares[8] === 'X') {
      return aiCanPlayEmptySide();
    }
    if (squares[2] === 'X' && squares[4] === 'O' && squares[6] === 'X') {
      return aiCanPlayEmptySide();
    }
    if (squares[5] === 'X' && squares[7] === 'X' && !squares[8]) {
      return 8;
    }
    return null;
  }

  function aiCanPlayCenter() {
    if (squares[4] !== 'X' && squares[4] !== 'O') {
      return 4;
    }
    return null;
  }

  function aiCanPlayOppositeCorner() {
    if (squares[0] === 'X' && !squares[8]) {
      return 8;
    }
    if (squares[8] === 'X' && !squares[0]) {
      return 0;
    }
    if (squares[2] === 'X' && !squares[6]) {
      return 6;
    }
    if (squares[6] === 'X' && !squares[2]) {
      return 2;
    }
    return null;
  }

  function aiCanPlayEmptyCorner() {
    const corners = [0, 2, 6, 8];
    for (let i = 0; i < corners.length; i++) {
      if (!squares[corners[i]]) {
        return corners[i];
      }
    }
    return null;
  }

  function aiCanPlayEmptySide() {
    const sides = [1, 3, 5, 7];
    for (let i = 0; i < sides.length; i++) {
      if (!squares[sides[i]]) {
        return sides[i];
      }
    }
    return null;
  }

  function playAIMove(nextSquares, loc) {
    nextSquares[loc] = 'O';
    setSquares(nextSquares);
    setXIsNext(true);
  }

  function getAIMove() {
    const nextSquares = squares.slice();

    let loc = aiCanWin();
    if (Number.isInteger(loc)) {
      console.log('ai winning');
      playAIMove(nextSquares, loc);
      return;
    } 

    loc = aiCanBlock();
    if (Number.isInteger(loc)) {
      console.log('ai blocking');
      playAIMove(nextSquares, loc);
      return;
    } 
    
    loc = aiCanBlockFork();
    if (Number.isInteger(loc)) {
      console.log('ai blocking fork');
      playAIMove(nextSquares, loc);
      return;
    }

    loc = aiCanPlayCenter();
    if (Number.isInteger(loc)) {
      console.log('playing center');
      playAIMove(nextSquares, loc);
      return;
    }   

    loc = aiCanPlayOppositeCorner();
    if (Number.isInteger(loc)) {
      console.log('playing opposite corner');
      playAIMove(nextSquares, loc);
      return;
    }

    loc = aiCanPlayEmptyCorner();
    if (Number.isInteger(loc)) {
      console.log('playing empty corner');
      playAIMove(nextSquares, loc);
      return;
    }

    loc = aiCanPlayEmptySide();
    if (Number.isInteger(loc)) {
      console.log('playing empty side');
      playAIMove(nextSquares, loc);
      return;
    }
    return true;
  }

  function resetClick() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  let tie;
  if (!xIsNext) {
    tie = getAIMove();
  }
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (tie) {
    status = "Tie";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
   <div className="board">
     <div className="status">{status}</div>
     <div className="board-row">
       <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
       <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
       <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
    </div>
    <div className="board-row">
       <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
       <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
       <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
    </div>
    <div className="board-row">
       <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
       <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
       <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
     </div>
     <button className="reset" onClick={resetClick}>Reset</button>
   </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}