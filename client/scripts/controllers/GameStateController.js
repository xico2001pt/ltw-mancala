import GameStateViewer from "../viewers/GameStateViewer.js";

export default class GameStateController {
    #viewer;
    #isMenu;

    constructor() {
        this.#viewer = new GameStateViewer();
        this.#isMenu = true;
    }

    startGame() {
        this.#isMenu = false;
        this.#viewer.updateUI(true);
    }

    exitGame() {
        this.#isMenu = true;
        this.#viewer.updateUI(false);
    }

    isMenu() {
        return this.#isMenu;
    }
}