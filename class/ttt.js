const Screen = require("./screen");
const Cursor = require("./cursor");
const ComputerPlayer = require('./computer-player');

class TTT {

  constructor() {

    this.playerTurn = null;

    this.grid = [[' ',' ',' '],
                 [' ',' ',' '],
                 [' ',' ',' ']]

    this.cursor = new Cursor(3, 3);

    this.computer = new ComputerPlayer();

    this.turn = 1;

    // Initialize a 3x3 tic-tac-toe grid
    Screen.initialize(3, 3);
    Screen.setGridlines(true);

    Screen.setBackgroundColor(0, 0, 'green')


    Screen.addCommand('up', 'move cursor up', this.cursor.up);
    Screen.addCommand('down', 'move cursor down', this.cursor.down);
    Screen.addCommand('left', 'move cursor left', this.cursor.left);
    Screen.addCommand('right', 'move cursor up', this.cursor.right);

    Screen.addCommand('p', 'show position', () => {
      console.log(`Row: ${this.cursor.row}, Column: ${this.cursor.col}`)
      let row = this.cursor.row;
      let col = this.cursor.col;
      console.log("\nValue: " + this.grid[row][col]);
    });

    Screen.addCommand('x', "place 'X' at the current spot", () => {
      if (this.playerTurn === null) {this.playerTurn = "X"}
      else if (this.playerTurn === "O") {
        console.log("You're not X! :)");
        return;
      }

      let row = this.cursor.row; let col = this.cursor.col;
      let spot = this.grid[row][col];

      if (spot === " ") {
        this.grid[row][col] = 'X';

        Screen.setGrid(row, col, "X")
        Screen.setTextColor(row, col, "blue")
        Screen.render();

        console.log( `You placed an X!`);

        let winner = TTT.checkWin(this.grid);
        if (winner) {
          TTT.endGame(winner);
          return;
        }

        TTT.computerMoveO(this.grid);

      }
    });

    Screen.addCommand('o', "place 'O' at the current spot", () => {
      if (this.playerTurn === null) {this.playerTurn = "O"}
      else if (this.playerTurn === "X") {
        console.log("You're not O! :)");
        return;
      }

      let row = this.cursor.row; let col = this.cursor.col;
      let spot = this.grid[row][col];

      if (spot === " ") {
        this.grid[row][col] = 'O';

        Screen.setGrid(row, col, "O");
        Screen.setTextColor(row, col, "red");
        Screen.render();

        console.log( `You placed an O!`);

        let winner = TTT.checkWin(this.grid);
        if (winner) {
          TTT.endGame(winner);
          return;
        }

        TTT.computerMoveX(this.grid);

      }
    });


    Screen.render();
    //TTT.computerMoveO(this.grid); this.player = "X"
    //TTT.computerMoveX(this.grid); this.player = "O"
  }


  static computerMoveX(grid) {
    console.log(grid)
    let aiMove = ComputerPlayer.getSmartMove(grid, "X")
    let aiRow = aiMove.row; let aiCol = aiMove.col;

    grid[aiRow][aiCol] = "X";

    Screen.setGrid(aiRow, aiCol, "X");
    Screen.setTextColor(aiRow, aiCol, "blue");
    Screen.render();

    let winner = TTT.checkWin(grid);
    if (winner) { TTT.endGame(winner) }

    //TTT.computerMoveO(grid);
  }

  static computerMoveO(grid) {
    let aiMove = ComputerPlayer.getSmartMove(grid, "O")
    let aiRow = aiMove.row; let aiCol = aiMove.col;

    grid[aiRow][aiCol] = "O";

    Screen.setGrid(aiRow, aiCol, "O");
    Screen.setTextColor(aiRow, aiCol, "red");
    Screen.render();

    let winner = TTT.checkWin(grid);
    if (winner) { TTT.endGame(winner) }

    //TTT.computerMoveX(grid);
  }

  static checkRows(grid) {
    let xCount = 0; let oCount = 0;

    for (let i1 = 0; i1 < 3; i1++) {
      let row = grid[i1];

      for (let i2 = 0; i2 < 3; i2++) {
        if (row[i2] === 'X') {xCount++}
        else if(row[i2] === 'O') {oCount++}
      }

      if (xCount === 3) {return 'X'}
      else if (oCount === 3) {return 'O'}

      xCount = 0; oCount = 0;
    }

    return false;
  }

  static checkCols(grid) {
    let xCount = 0; let oCount = 0;

    for (let i1 = 0; i1 < 3; i1++) {

      for (let i2 = 0; i2 < 3; i2++) {
        if (grid[i2][i1] === 'X') {xCount++}
        else if(grid[i2][i1] === 'O') {oCount++}
      }

      if (xCount === 3) {return 'X'}
      else if (oCount === 3) {return 'O'}

      xCount = 0; oCount = 0;
    }

    return false;
  }

  static checkHorizontals(grid) {
    let xCount = 0; let oCount = 0;

    for (let i = 0; i < 3; i++) {
      if (grid[i][i] === "X") {xCount++}
      else if (grid[i][i] === "O") {oCount++}
    }

    if (xCount === 3) {return 'X'}
    else if (oCount === 3) {return 'O'}

    xCount = 0; oCount = 0;

    if (grid[2][0] === 'X') {xCount++}
    else if (grid[2][0] === 'O' ) {oCount++}

    if (grid[1][1] === 'X') {xCount++}
    else if (grid[1][1] === 'O' ) {oCount++}

    if (grid[0][2] === 'X') {xCount++}
    else if (grid[0][2] === 'O' ) {oCount++}

    if (xCount === 3) {return 'X'}
    else if (oCount ===3) {return 'O'}
    else {return false}
  }

  static checkTie(grid) {
    let count = 0;

    grid.forEach( row => {
      row.forEach (spot => {
        if (spot === 'X' || spot === "O") {count += 1}
      });
    });

    if (count === 9) {return "T"}
    else {return false}
  }

  static checkWin(grid) {

    //rows
    let rows = TTT.checkRows(grid);
    if (rows) {return rows}

    //columns
    let cols = TTT.checkCols(grid);
    if (cols) {return cols}

    //horizontal
    let horizontals = TTT.checkHorizontals(grid);
    if (horizontals) {return horizontals}

    //checking for a tie
    let tie = TTT.checkTie(grid);
    if (tie) {return tie}

    //if all else fails
    return false;
  }

  static endGame(winner) {
    if (winner === 'O' || winner === 'X') {
      Screen.setMessage(`Player ${winner} wins!`);
    } else if (winner === 'T') {
      Screen.setMessage(`Tie game!`);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }

}

module.exports = TTT;
