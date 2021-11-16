import Side from "./Side.js";

export default class Board {
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