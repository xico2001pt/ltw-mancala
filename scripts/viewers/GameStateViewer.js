import {changeVisibility} from "../utils.js"

export default class GameStateViewer {
    #navigation;
    #menuContent;
    #gameContent;

    constructor() {
        this.#initializeElements();
        this.updateUI(false);
    }

    updateUI(playing) {
        changeVisibility(this.#navigation, !playing);
        changeVisibility(this.#menuContent, !playing);
        changeVisibility(this.#gameContent, playing);
    }

    #initializeElements() {
        this.#navigation = document.getElementsByTagName("nav")[0];
        this.#menuContent = document.getElementById("menu-content");
        this.#gameContent = document.getElementById("game-content");
    }
}