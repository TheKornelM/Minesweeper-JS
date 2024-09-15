"use strict";


import State from "./State.js";
import Field from "./Field.js";

/*
  Minesweeper osztály: Tárolja a játékhoz szükséges adatokat

  Mezők:
    this.size:
      A táblázat mérete (this.size*this.size)
    mineCount
      A játékban lévő aknák száma, ami a generált táblázat méretétől függ.
    remainFields
      A hátralévő, nem kiválasztott mezők száma
      Ha egyenlő a mineCount-al, akkor a játék megnyerésre került.
    flaggedFields:
      A zászlóval jelölt helyek száma
    hasRevealedMine
      Tárolja, hogy a játékos aknát fedett-e fel (true: igen, false: nem)
    fields:
      Mezőket tároló mátrix, dinamikus allokálású
*/

export default class Minesweeper {
    size;
    mineCount;
    remainFields;
    flaggedFields;
    hasRevealedMine;
    fields;

    constructor(s) {
        this.size = s;
        this.mineCount = 0;
        this.hasRevealedMine = false;
        this.remainFields = this.size * this.size;
        this.mineCount = (this.size * this.size) * 0.16;
        this.flaggedFields = 0;
        this.#allocateFields();
    }



    // fieldExists: ellenőrzi, hogy az adott mező hely létezik-e
    fieldExists(row, column) {
        return row >= 0 && column >= 0 && row < this.size && column < this.size;
    }

    selectField(row, column) {
        /* Korábban felfedett mezőt, illetve zászlóval jelölt helyet
          nem választhat a felhasználó, előtte el kell azt távolítania. */
        if (this.fields[row][column].state == State.REVEALED ||
            this.fields[row][column].state == State.FLAGGED)
            return;


        if (this.fields[row][column].hasMine) {
            this.hasRevealedMine = true;
            this.fields[row][column].state = State.REVEALED;
        }

        /* Aknák csak az első lépés után generálódnak, hogy
          a felhasználó ne lépjen egyszerre aknára.*/
        if (this.remainFields == this.size * this.size) {
            this.#generateMines(row, column);
        }
    }

    // unrevealField: rekurzív algoritmus, ami felfedi a környező aknamentes mezőket
    unrevealField(row, column) {
        /* Amennyiben az adott mező nem érvényes (pl. negatív szám), vagy
          korábban már felfedésre került az adott hely, akkor a rekurzió befejeződik. */
        if (!this.fieldExists(row, column) || this.fields[row][column].state == State.REVEALED) {
            return;
        }

        if (this.fields[row][column].state == State.FLAGGED) {
            this.flaggedFields--;
        }

        this.fields[row][column].state = State.REVEALED;
        this.remainFields--;

        /* Ha egy hely körül van szomszédos akna, akkor azt a helyet felfedjük,
          és utána fejeződik be a rekurzió. */
        if (this.fields[row][column].neighborMineCount != 0) {
            return;
        }

        // Felfedjük a szomszédos mezőket.
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                this.unrevealField(row + i, column + j);
            }
        }
    }

    changeFlag(row, column) {
        if (this.fields[row][column].state == State.FLAGGED) {
            this.fields[row][column].state = State.UNSELECTED;
            this.flaggedFields--;
        }
        else if (this.fields[row][column].state == State.UNSELECTED) {
            this.fields[row][column].state = State.FLAGGED;
            this.flaggedFields++;
        }
    }

    getRemainFieldsByFlags() {
        return this.mineCount - this.flaggedFields;
    }

    //private:

    // allocateFields: mátrix dinamikus allokációjáért felelős metódus
    #allocateFields() {
        this.fields = new Array(this.size);

        for (let i = 0; i < this.size; i++) {
            this.fields[i] = new Array(this.size);

            for (let j = 0; j < this.size; j++) {
                this.fields[i][j] = new Field(this.size);
            }
        }
    }


    /* Aknák generálásáért felelős algoritmus
      firstStepRow: első kiválasztott akna sorszáma
      firstStepColumn: első kiválasztott akna oszlopszáma.
      Ezek szükségesek, hogy oda ne kerüljön akna.
    */
    #generateMines(firstStepRow, firstStepColumn) {
        for (let i = 0; i < this.mineCount;) {
            let row = Math.floor(Math.random() * this.size);
            let column = Math.floor(Math.random() * this.size);
            if (!this.fields[row][column].hasMine && !(row == firstStepRow && column == firstStepColumn)) {
                this.fields[row][column].hasMine = true;
                i++;
                for (let j = -1; j <= 1; j++) {
                    for (let k = -1; k <= 1; k++) {
                        if (this.fieldExists(row + j, column + k) && !(j == 0 && k == 0)) {
                            this.fields[row + j][column + k].neighborMineCount++;
                        }
                    }
                }
            }
        }
    }
};