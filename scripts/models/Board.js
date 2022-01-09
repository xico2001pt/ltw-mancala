import Side from "./Side.js";

export default class Board {
    #side1;
    #side2;
    #holesPerSide;
    #totalSeeds;

    constructor(numOfHoles, numOfSeeds) {
        numOfHoles = parseInt(numOfHoles);
        numOfSeeds = parseInt(numOfSeeds);
        this.#side1 = new Side(numOfHoles, numOfSeeds);
        this.#side2 = new Side(numOfHoles, numOfSeeds);
        this.#holesPerSide = numOfHoles;
        this.#totalSeeds = Board.getNumOfSides() * numOfHoles * numOfSeeds;
    }

    copy() {
        let board = new Board(this.#holesPerSide, 0);
        for (let i = 0; i < Board.getNumOfSides(); ++i) {
            for (let j = 0; j < this.getHolesPerSide(); ++j) {
                board.getSide(i).getHole(j).setNumOfSeeds(this.getSide(i).getHole(j).getNumOfSeeds());
            }
            board.getSide(i).getStorage().setNumOfSeeds(this.getSide(i).getStorage().getNumOfSeeds());
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

    getTotalSeeds() {
        return this.#totalSeeds;
    }

    static parseMultiplayer(board, nick) {
        console.log(board);
        let numOfHoles = board["sides"][board["turn"]]["pits"].length;
        let seedsPerHole = Board.#countSeedsMultiplayer(board, numOfHoles) / (2 * numOfHoles);

        let result = new Board(numOfHoles, seedsPerHole);
        for (let pair of Object.entries(board["sides"])) {
            let i = (pair[0] == nick ? 1 : 0)
            for (let j = 0; j < result.getHolesPerSide(); ++j) {
                result.getSide(i).getHole(j).setNumOfSeeds(pair[1]["pits"][j])
            }
            result.getSide(i).getStorage().setNumOfSeeds(pair[1]["store"]);
        }
        return result;
    }

    static #countSeedsMultiplayer(board, holesPerSide) {
        let totalSeeds = 0;
        let i = 0;
        for (let pair of Object.entries(board["sides"])) {
            for (let j = 0; j < holesPerSide; ++j) {
                totalSeeds += pair[1]["pits"][j];
            }
            totalSeeds += pair[1]["store"];
            ++i;
        }
        return totalSeeds;
    }
}