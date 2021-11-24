export default class Player {
    #id;
    #name;
    #isBot;
    #score;

    constructor(id, name, isBot) {
        this.#id = id;
        this.#name = name;
        this.#isBot = isBot;
        this.#score = 0;
    }

    getId() {
        return this.#id;
    }

    getName() {
        return this.#name;
    }

    getIsBot() {
        return this.#isBot;
    }

    getScore() {
        return this.#score;
    }

    setScore(score) {
        this.#score = score;
    }
}