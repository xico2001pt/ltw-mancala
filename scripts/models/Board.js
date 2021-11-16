import Side from "./models/Side.js";

export default class Board {
    #side1;
    #side2;

    constructor(numOfHoles, numOfSeeds) {
        this.#side1 = new Side(numOfHoles, numOfSeeds);
        this.#side2 = new Side(numOfHoles, numOfSeeds);
    }
}