import { changeVisibility, selectButton, deselectButton } from "../utils.js";

export default class MenuController {
    #menusButtons;
    #menusContents;
    #currentMenu;

    constructor() {
        this.#menusButtons = [];
        this.#menusContents = [];
        this.#currentMenu = 0;

        this.#initializeMenu();
    }

    #initializeMenu() {
        const MENUS = ["play", "instructions", "leaderboard"];
    
        for (let i = 0; i < MENUS.length; ++i) {
            this.#menusButtons[i] = document.getElementById(MENUS[i] + "-button");
            this.#menusButtons[i].addEventListener("click", () => this.#changeMenu(i));
            this.#menusContents[i] = document.getElementById(MENUS[i] + "-content");
        }
        selectButton(this.#menusButtons[this.#currentMenu])
    
        for (let i = 1; i < this.#menusButtons.length; ++i) {
            deselectButton(this.#menusButtons[i]);
            changeVisibility(this.#menusContents[i], false);
        }
    }

    #changeMenu(id) {
        if (id == this.#currentMenu || id < 0 || id >= this.#menusContents.length) return;

        deselectButton(this.#menusButtons[this.#currentMenu]);
        changeVisibility(this.#menusContents[this.#currentMenu], false);
        this.#currentMenu = id;
        selectButton(this.#menusButtons[this.#currentMenu]);
        changeVisibility(this.#menusContents[this.#currentMenu], true);
    }
}