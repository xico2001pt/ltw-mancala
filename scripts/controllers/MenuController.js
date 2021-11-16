import MenuViewer from "../viewers/MenuViewer.js";

export default class MenuController {
    #viewer;
    #currentMenu;

    constructor(startMenuIndex) {
        this.#viewer = new MenuViewer(startMenuIndex);
        this.#currentMenu = startMenuIndex;

        this.#initializeMenu();
    }

    #initializeMenu() {
        let buttons = this.#viewer.getMenuButtons();
        for (let i = 0; i < buttons.length; ++i) {
            buttons[i].addEventListener("click", () => this.#changeMenu(i));
        }
    }

    #changeMenu(id) {
        if (id == this.#currentMenu || id < 0 || id >= this.#viewer.getMenuButtons().length) return;

        this.#viewer.changeMenu(this.#currentMenu, false);
        this.#viewer.changeMenu(id, true);

        this.#currentMenu = id;
    }
}