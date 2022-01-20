import { changeVisibility, changeSelection } from "../utils.js";

export default class GameBuilderViewer {
    #singleplayerButton;
    #multiplayerButton;
    #difficultyOption;

    constructor() {
        this.#initializeElements();
    }

    getSingleplayerButton() {
        return this.#singleplayerButton;
    }

    getMultiplayerButton() {
        return this.#multiplayerButton;
    }

    changeMode(isSingleplayer) {
        changeSelection(this.#singleplayerButton, isSingleplayer);
        changeSelection(this.#multiplayerButton, !isSingleplayer);
        
        changeVisibility(this.#difficultyOption, isSingleplayer);
    }

    #initializeElements() {
        this.#singleplayerButton = document.getElementById("singleplayer-button");
        this.#multiplayerButton = document.getElementById("multiplayer-button");

        this.#difficultyOption = document.getElementById("difficulty-option");
    }
}