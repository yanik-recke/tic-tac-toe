import React from 'react';
import { useState } from 'react';


function Square({ value, onSquareClick, isWon }) {

    return (
        <button className="square" onClick={onSquareClick} style={{backgroundColor: isWon}}>
            {value}
        </button>
    );
}


export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const [jumped, setJumped] = useState(false);

    const isXNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        setJumped(false);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
        setJumped(true);
    }

    const moves = history.map((squares, move) => {
        let desc;

        if (move > 0) {
            desc = "Go to move #" + move;
        } else {
            desc = "Go to game start";
        }

        if (!jumped && move == history.length - 1) {
            return (
                <li key={move}>
                    <p>You are at move #{move}</p>
                </li>
            );
        } else {
            return (
                <li key={move}>
                    <button className="historyButton" onClick={() => jumpTo(move)}>{desc}</button>
                </li>
            );
        }
    });

    return (
        <div className ="game">
            <div className="game-board">
                <Board isXNext={isXNext} squares={currentSquares} onPlay={handlePlay} currMove={currentMove}/>
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    )
}


function Board({ isXNext, squares, onPlay, currMove }) {

    function handleClick(number) {
        // early return if square has already been clicked
        if (squares[number] || winner != null) {
            return;
        }

        // copy of array
        const nextSquares = squares.slice();

        if (isXNext) {
            nextSquares[number] = "X";
        } else {
            nextSquares[number] = "O";
        }

        onPlay(nextSquares);
    }

    let status;
    const winner = calculateWinner(squares);
    if (winner != null) {
        status = "Winner: " + squares[winner[0]];
    } else {
        if (currMove == 9) {
            status = "It's a draw!";
        } else {
            status = "Next player: " + (isXNext ? "X" : "O");
        }
    }

    let buttons = [];
    const divs = [];
    let num = 0;

    for (let i = 0; i < 3; i++) {
        buttons = [];
        for (let j = 0; j < 3; j++) {
            let temp = num;
            if (winner != null && winner.includes(temp)) {
                buttons.push(<Square value={squares[num]} isWon="green" onSquareClick={() => handleClick(temp)}/>)
            } else {
                buttons.push(<Square value={squares[num]} onSquareClick={() => handleClick(temp)}/>)
            }

            num++;
        }

        divs.push(<div className="board-row">{buttons}</div>);
    }

    return (
        <React.Fragment>
            <div className="status">{status}</div>
            {divs}
        </React.Fragment>
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
            return lines[i];
        }
    }

    return null;
}

