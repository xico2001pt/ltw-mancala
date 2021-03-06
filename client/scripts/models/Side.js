import Hole from "./Hole.js";

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

    getNumHoles() {
        return this.#sideHoles.length;
    }

    getStorage() {
        return this.#storage;
    }

    getNumOfSeeds() {
        let counter = 0;
        for (let i = 0; i < this.#sideHoles.length; ++i) {
            counter += this.#sideHoles[i].getNumOfSeeds();
        }
        return counter;
    }
} 