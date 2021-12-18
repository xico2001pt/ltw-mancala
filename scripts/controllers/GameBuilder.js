import GameBuilderViewer from "../viewers/GameBuilderViewer.js";
import BoardConfiguration from "../models/BoardConfiguration.js"
import Player from "../models/Player.js";

export default class GameBuilder {
    #viewer;
    #gameStateController;
    #gameController;
    #authenticationController;
    //#menuController;

    #form;

    constructor(gameStateController, gameController, authenticationController) {
        this.#viewer = new GameBuilderViewer();
        this.#gameStateController = gameStateController;
        this.#gameController = gameController;
        this.#authenticationController = authenticationController;
        this.#initialize();
    }

    startGame() {
        let holesPerSide = this.#form.holesPerSide.value;
        let seedsPerHole = this.#form.seedsPerHole.value;
        let playFirst = this.#form.playFirst.checked;
        let config = new BoardConfiguration(holesPerSide, seedsPerHole, playFirst);
        
        let playerNick = this.#authenticationController.isLoggedIn() ? this.#authenticationController.getCredentials()["nick"] : "Guest";
        let players = [new Player("Computer", this.#form.difficulty.value), new Player(playerNick , -1)];
        this.#gameController.startGame(config, players);
        this.#gameStateController.startGame();
    }

    #initialize() {
        this.#form = document.getElementById("game-config");

        document.getElementById("start-game-button").addEventListener("click", () => this.startGame());
    }
}