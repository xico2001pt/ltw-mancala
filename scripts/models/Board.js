import Side from "./models/Side.js";
export default { Board, BoardConfiguration }

function BoardConfiguration(holesPerSide, seedsPerHole, firstPlayer) {
    this.holesPerSide = holesPerSide;
    this.seedsPerHole = seedsPerHole;
    this.firstPlayer =  firstPlayer;
}

class Board {
    #side1;
    #side2;

    constructor(numOfHoles, numOfSeeds) {
        this.#side1 = new Side(numOfHoles, numOfSeeds);
        this.#side2 = new Side(numOfHoles, numOfSeeds);
    }

    getSide(side) {
        if (side == 0) return this.#side1;
        else if (side == 1) return this.#side2;
        return undefined;
    }
}