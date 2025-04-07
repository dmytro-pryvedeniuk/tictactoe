import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import GameOver from "./components/GameOver";
import { useState } from "react";
import { WINNING_COMBINATIONS } from "./components/winning-combinations";

const INITIAL_PLAYERS = {
  "X": "Player1",
  "O": "Player2"
}

function getActivePlayer(turns) {
  return turns.length > 0 && turns[0].player === "X" ? "O" : "X";
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
  const INITIAL_GAME_BOARD = [
    [null, null, null], // null, X, O
    [null, null, null],
    [null, null, null]
  ]

  const gameBoard = INITIAL_GAME_BOARD;
  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = player;
  }
  return gameBoard;
}

export default function App() {
  const [players, setPlayers] = useState(INITIAL_PLAYERS)
  const [gameTurns, setGameTurns] = useState([]);

  let activePlayer = getActivePlayer(gameTurns);

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
      let currentPlayer = getActivePlayer(prevTurns);

      const updatedTurns = [
        {
          square: {
            row: rowIndex,
            col: colIndex
          },
          player: currentPlayer
        },
        ...prevTurns
      ]

      return updatedTurns;
    });
  }

  return <main>
    <div id="game-container">
      <ol id="players" className="highlight-player">
        <Player
          initialName={INITIAL_PLAYERS.X}
          symbol="X"
          isActive={activePlayer === "X"}
          onNameChange={handlePlayerNameChange} />

        <Player
          initialName={INITIAL_PLAYERS.O}
          symbol="O"
          isActive={activePlayer === "O"}
          onNameChange={handlePlayerNameChange} />
      </ol>
      {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart} />}
      <GameBoard
        onSelectSquare={handleSelectSquare}
        board={gameBoard} />
    </div>
    <Log turns={gameTurns} />
  </main>
}

