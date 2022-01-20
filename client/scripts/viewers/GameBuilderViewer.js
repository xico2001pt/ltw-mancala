import { changeVisibility, changeSelection } from "../utils.js";

export default class GameBuilderViewer {
    #globalButton;
    #groupButton;

    #singleplayerButton;
    #multiplayerButton;

    #difficultyOption;

    constructor() {
        this.#initializeElements();
    }

    getGlobalButton() {
        return this.#globalButton;
    }

    getGroupButton() {
        return this.#groupButton;
    }

    getSingleplayerButton() {
        return this.#singleplayerButton;
    }

    getMultiplayerButton() {
        return this.#multiplayerButton;
    }

    changeServer(isGlobal) {
        changeSelection(this.#globalButton, isGlobal);
        changeSelection(this.#groupButton, !isGlobal);
    }

    changeMode(isSingleplayer) {
        changeSelection(this.#singleplayerButton, isSingleplayer);
        changeSelection(this.#multiplayerButton, !isSingleplayer);
        
        changeVisibility(this.#difficultyOption, isSingleplayer);
    }

    #initializeElements() {
        this.#globalButton = document.getElementById("global-server-button");
        this.#groupButton = document.getElementById("group-server-button");

        this.#singleplayerButton = document.getElementById("singleplayer-button");
        this.#multiplayerButton = document.getElementById("multiplayer-button");

        this.#difficultyOption = document.getElementById("difficulty-option");
    }
}