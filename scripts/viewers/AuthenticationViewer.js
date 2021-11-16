import { changeVisibility } from "../utils.js";

export default class AuthenticationViewer {
    #modesElements;

    constructor() {
        this.#modesElements = [];
        
        this.#initializeElements();
    }

    displayUserArea(isLoggedIn) {
        changeVisibility(this.#modesElements[0], !isLoggedIn);
        changeVisibility(this.#modesElements[1], isLoggedIn);
    }

    #initializeElements() {
        const MODES = ["navigation-authentication", "navigation-logout"];

        for (let i = 0; i < MODES.length; ++i) {
            this.#modesElements[i] = document.getElementById(MODES[i]);
        }
    }
}