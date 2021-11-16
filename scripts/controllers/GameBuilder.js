import {changeVisibility} from "../utils.js"

export default class GameBuilder {
    //#menuController;
    //#authenticationController;
    #navigation;
    #menuContent;
    #gameContent;

    constructor(menuController, authenticationController) {
        this.#initializeData();
        //this.#updateUI(false);
    }

    startGame() {
        
    }

    #initializeData() {
        this.#navigation = document.getElementsByTagName("nav")[0];
        this.#menuContent = document.getElementById("menu-content");
        this.#gameContent = document.getElementById("game-content");
    }
    
    #updateUI(playing) {
        changeVisibility(this.#navigation, !playing);
        changeVisibility(this.#menuContent, !playing);
        changeVisibility(this.#gameContent, playing);
    }
}