import Minesweeper from "./Minesweeper.js"
import State from "./State.js"

export default class BoardView {
    board;
    constructor() {
        this.board = new Minesweeper(7);
    }

    drawTable() {
        document.getElementById("remain-fields").innerHTML = `Remain fields: ${this.board.remainFields}`
        document.getElementById("content").innerHTML = "";
        let str = "";
        for (let i = 0; i < this.board.size; i++) {
            for (let j = 0; j < this.board.size; j++) {
                str += this.displayField(i, j) + "\t";
            }
            str += "<br>";
        }
        document.getElementById("content").innerHTML = str;

    }

    printInfo() {
        console.log(`Remain fields: ${this.board.remainFields}\n
            mineCount: ${this.board.mineCount}\n`)
    }

    displayField(row, column) {
        switch (this.board.fields[row][column].state) {
            case State.UNSELECTED:
                if (this.board.hasRevealedMine && this.board.fields[row][column].hasMine) {
                    return "M";
                } else {
                    return this.board.fields[row][column].neighborMineCount;
                }
            case State.REVEALED:
                if (this.board.fields[row][column].hasMine) {
                    // A felhasználó által felfedett aknát piros alapon jelenítjük meg.
                    return "M";
                } else {
                    return this.board.fields[row][column].neighborMineCount;
                }
            case State.FLAGGED:
                return "F";
        }
    }
}
