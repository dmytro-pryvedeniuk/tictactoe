import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import GameOver from "./components/GameOver";
import { useState } from "react";
import { WINNING_COMBINATIONS } from "./components/winning-combinations";


const PLAYERS = {
  "X": "Player1",
  "O": "Player2"
}
const SYMBOLS = Object.keys(PLAYERS);

function getActiveSymbol(turns) {
  return turns.length > 0 && turns[0].symbol === SYMBOLS[0]
    ? SYMBOLS[1]
    : SYMBOLS[0];
}

function getWinner(gameBoard, players) {
  for (const combinations of WINNING_COMBINATIONS) {
    const symbols = [];
    for (let i = 0; i < 3; i++) {
      const combination = combinations[i];
      const symbol = gameBoard[combination.row][combination.column];
      symbols[i] = symbol;
    }
    if (symbols.length > 0 && symbols.every(x => x === symbols[0])) {
      return players[symbols[0]];
    }
  }
  return null;
}

function getBoard(gameTurns) {
  const gameBoard = [
    [null, null, null], // null, X, O
    [null, null, null],
    [null, null, null]
  ];
  for (const turn of gameTurns) {
    const { square, symbol } = turn;
    const { row, col } = square;
    gameBoard[row][col] = symbol;
  }
  return gameBoard;
}

export default function App() {
  const [players, setPlayers] = useState(PLAYERS)
  const [gameTurns, setGameTurns] = useState([]);

  let activeSymbol = getActiveSymbol(gameTurns);

  const gameBoard = getBoard(gameTurns);
  const winner = getWinner(gameBoard, players);
  const hasDraw = gameTurns.length == 9 && !winner;

  function handleRestart() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers(prevPlayers => {
      return {
        ...prevPlayers,
        [symbol]: newName
      }
    });
  }

  function handleSelectSquare(rowIndex, colIndex) {

    setGameTurns(prevTurns => {
      let activeSymbol = getActiveSymbol(prevTurns);

      const updatedTurns = [
        {
          square: {
            row: rowIndex,
            col: colIndex
          },
          symbol: activeSymbol
        },
        ...prevTurns
      ]

      return updatedTurns;
    });
  }

  return <main>
    <div id="game-container">
      <ol id="players" className="highlight-player">
        {
          SYMBOLS.map(key =>
            <Player
              key={key}
              initialName={players[key]}
              symbol={key}
              isActive={activeSymbol === key}
              onNameChange={handlePlayerNameChange} />
          )
        }
      </ol>
      {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart} />}
      <GameBoard
        onSelectSquare={handleSelectSquare}
        board={gameBoard} />
    </div>
    <Log turns={gameTurns} />
  </main>
}

