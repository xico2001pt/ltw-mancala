import Hole from "./models/Hole.js";

export default class Side {
    #sideHoles;
    #storage;

    constructor(numOfHoles, numOfSeeds) {
        this.#storage = new Hole(0);
        this.#sideHoles = [];
        for (let i = 0; i < numOfHoles; ++i) {
            this.#sideHoles[i] = new Hole(numOfSeeds);
        }
    }

    getHole(id) {
        return this.#sideHoles[id];
    }
} 