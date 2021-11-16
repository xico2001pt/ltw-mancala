import { changeVisibility, changeSelection } from "../utils.js";

export default class MenuViewer {
    #menuButtons;
    #menuContents;

    constructor(startMenu) {
        this.#initializeElements(startMenu);
    }

    getMenuButtons() {
        return this.#menuButtons;
    }

    changeMenu(menuIndex, selected) {
        changeSelection(this.#menuButtons[menuIndex], selected);
        changeVisibility(this.#menuContents[menuIndex], selected);
    }

    #initializeElements(startMenu) {
        const MENUS = ["play", "instructions", "leaderboard"];

        this.#menuButtons = [];
        this.#menuContents = [];

        for (let i = 0; i < MENUS.length; ++i) {
            this.#menuButtons[i] = document.getElementById(MENUS[i] + "-button");
            this.#menuContents[i] = document.getElementById(MENUS[i] + "-content");

            this.changeMenu(i, false);
        }

        this.changeMenu(startMenu, true);
    }
}