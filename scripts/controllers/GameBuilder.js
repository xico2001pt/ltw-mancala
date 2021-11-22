import GameBuilderViewer from "../viewers/GameBuilderViewer.js";
import BoardConfiguration from "../models/BoardConfiguration.js"

export default class GameBuilder {
    #viewer;
    #gameController;
    //#menuController;
    //#authenticationController;

    #form;

    constructor(gameController) {
        this.#viewer = new GameBuilderViewer();
        this.#gameController = gameController;
        this.#initialize();
        this.#viewer.updateUI(false);
    }

    startGame() {
        let holesPerSide = this.#form.holesPerSide.value;
        let seedsPerHole = this.#form.seedsPerHole.value;
        let playFirst = this.#form.playFirst.checked;
        let config = new BoardConfiguration(holesPerSide, seedsPerHole, playFirst);
        
        this.#gameController.startGame(config);
        this.#viewer.updateUI(true);
    }

    exitGame() {
        this.#viewer.updateUI(false);
    }

    #initialize() {
        this.#form = document.getElementById("game-config");

        document.getElementById("start-game-button").addEventListener("click", () => this.startGame());
        document.getElementById("exit-game-button").addEventListener("click", () => this.exitGame());
    }
}