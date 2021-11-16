import {changeVisibility} from "../utils.js"

export default class GameBuilder {
    //#menuController;
    //#authenticationController;
    #navigation;
    #menuContent;
    #gameContent;

    constructor(menuController, authenticationController) {
        this.#initialize();
        this.#updateUI(false);
    }

    startGame() {
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