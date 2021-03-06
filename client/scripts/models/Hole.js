export default class Hole {
    #numOfSeeds;

    constructor(numOfSeeds) {
        this.#numOfSeeds = numOfSeeds;
    }

    getNumOfSeeds() {
        return this.#numOfSeeds;
    }

    setNumOfSeeds(numOfSeeds) {
        this.#numOfSeeds = parseInt(numOfSeeds);
    }
    
    incrementSeed() {
        ++this.#numOfSeeds;
    }
}