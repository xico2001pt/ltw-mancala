import GameStateViewer from "../viewers/GameStateViewer.js";

export default class GameStateController {
    #viewer;

    constructor() {
        this.#viewer = new GameStateViewer();
    }

    startGame() {
        this.#viewer.updateUI(true);
    }

    exitGame() {
        this.#viewer.updateUI(false);
    }
}