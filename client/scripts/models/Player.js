export default class Player {
    #name;
    #difficulty;  // If not a bot then -1
    #score;

    constructor(name, difficulty) {
        this.#name = name;
        this.#difficulty = difficulty;
        this.#score = 0;
    }

    getName() {
        return this.#name;
    }

    getIsBot() {
        return this.#difficulty >= 0;
    }

    getDifficulty() {
        return this.#difficulty;
    }

    getScore() {
        return this.#score;
    }

    setScore(score) {
        this.#score = parseInt(score);
    }
}