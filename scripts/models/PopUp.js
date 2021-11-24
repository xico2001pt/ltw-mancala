export default class PopUp {
    #playerWinner;
    #playerLoser;
    #callback;

    constructor(playerWinner, playerLoser, callback) {
        this.#playerWinner = playerWinner;
        this.#playerLoser = playerLoser;
        this.#callback = callback;
    }

    getPlayerWinner() {
        return this.#playerWinner;
    }

    getPlayerLoser() {
        return this.#playerLoser;
    }
}