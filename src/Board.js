import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows, ncols, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard());
  console.log('board', board);
  const won = hasWon() ? false : true;
  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function getTrueFalse(){
    let val = Math.floor(Math.random()*2);
    let bool = val === 0 ? false : true;
    return bool;
  }

  function createBoard() {
    let initialBoard = [];

    for (let row=0; row<nrows; row++){
      let subArr = [];
      for (let col=0; col<ncols; col++){
        subArr.push(getTrueFalse());
      }
      initialBoard.push(subArr);
    }
    return initialBoard;
  }

  // if we found a true value in flattened array, we haven't won yet
  function hasWon() {
    let flatArr = board.flat();
    console.log('flatArr', flatArr);
    return flatArr.find(b => b === true);
  }

  function flipCellsAround(coord) {
    console.log('coord', coord);
    setBoard(oldBoard => {
      //'1-3' => [1, 3]
      const [y, x] = coord.split("-").map(Number);
      
      //N,E,S,W
      const neighborCoords = [[y-1,x],[y,x+1],[y+1,x],[y,x-1]];

      const boardCopy = [];
      for(let sub of oldBoard) boardCopy.push([...sub]);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      flipCell(y, x, boardCopy);
      neighborCoords.map(([y,x]) => flipCell(y,x,boardCopy));

      return boardCopy;
      
    });
  }
  
  return (
      <div>
          <h1>{won && "You won!"}</h1>
            <table>
              <tbody>{board.map((row, x) => 
                <tr key={x}>{row.map((col, y) => 
                  <Cell 
                    key={`${x}${y}`}
                    id={`${x}-${y}`}
                    isLit={board[x][y]}
                    flipCellsAroundMe={flipCellsAround} 
                    />)}
                </tr>)}
              </tbody>
            </table>
      </div>
  )
}

export default Board;
