import {changeVisibility} from "../utils.js"
import BoardConfiguration from "../models/BoardConfiguration.js"

export default class GameBuilder {
    #gameController;
    //#menuController;
    //#authenticationController;
    #navigation;
    #menuContent;
    #gameContent;

    constructor(gameController) {
        this.#gameController = gameController;
        this.#initialize();
        this.#updateUI(false);
    }

    startGame() {
        let config = new BoardConfiguration(2, 2, 0);
        this.#gameController.startGame(config);
        this.#updateUI(true);
    }

    exitGame() {
        this.#updateUI(false);
    }

    #initialize() {
        this.#navigation = document.getElementsByTagName("nav")[0];
        this.#menuContent = document.getElementById("menu-content");
        this.#gameContent = document.getElementById("game-content");

        document.getElementById("start-game-button").addEventListener("click", () => this.startGame());
        document.getElementById("exit-game-button").addEventListener("click", () => this.exitGame());
    }
    
    #updateUI(playing) {
        changeVisibility(this.#navigation, !playing);
        changeVisibility(this.#menuContent, !playing);
        changeVisibility(this.#gameContent, playing);
    }
}