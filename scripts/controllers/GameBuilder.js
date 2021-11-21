import {changeVisibility} from "../utils.js"
import BoardConfiguration from "../models/BoardConfiguration.js"

export default class GameBuilder {
    #gameController;
    //#menuController;
    //#authenticationController;
    #navigation;
    #menuContent;
    #gameContent;

    #form;

    constructor(gameController) {
        this.#gameController = gameController;
        this.#initialize();
        this.#updateUI(false);
    }

    startGame() {
        let holesPerSide = this.#form.holesPerSide.value;
        let seedsPerHole = this.#form.seedsPerHole.value;
        let playFirst = this.#form.playFirst.checked;
        let config = new BoardConfiguration(holesPerSide, seedsPerHole, playFirst);
        
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

        this.#form = document.getElementById("game-config");

        document.getElementById("start-game-button").addEventListener("click", () => this.startGame());
        document.getElementById("exit-game-button").addEventListener("click", () => this.exitGame());
    }
    
    #updateUI(playing) {
        changeVisibility(this.#navigation, !playing);
        changeVisibility(this.#menuContent, !playing);
        changeVisibility(this.#gameContent, playing);
    }
}