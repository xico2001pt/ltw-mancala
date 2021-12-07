import Side from "./Side.js";

export default class Board {
    #side1;
    #side2;
    #holesPerSide;

    constructor(numOfHoles, numOfSeeds) {
        this.#side1 = new Side(numOfHoles, numOfSeeds);
        this.#side2 = new Side(numOfHoles, numOfSeeds);
        this.#holesPerSide = numOfHoles;
    }

    copy() {
        let board = new Board(this.#holesPerSide, 0);
        for (let i = 0; i < Board.getNumOfSides(); ++i) {
            for (let j = 0; j < this.getHolesPerSide(); ++j) {
                board.getSide(i).getHole(j).setNumOfSeeds(this.getSide(i).getHole(j).getNumOfSeeds());
            }
        }
        return board;
    }

    static getNumOfSides() {
        return 2;
    }

    getSide(side) {
        if (side == 0) return this.#side1;
        else if (side == 1) return this.#side2;
        return undefined;
    }

    getHolesPerSide() {
        return this.#holesPerSide;
    }
}