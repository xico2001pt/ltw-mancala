import { changeVisibility } from "../utils.js";

export default class AuthenticationViewer {
    #modesElements;
    #form;
    #message;

    constructor() {
        this.#modesElements = [];
        
        this.#initializeElements();
    }

    getForm() {
        return this.#form;
    }

    displayUserArea(isLoggedIn) {
        changeVisibility(this.#modesElements[0], !isLoggedIn);
        changeVisibility(this.#modesElements[1], isLoggedIn);
    }

    displayUsername(nick) {
        this.#message.innerText = `Welcome, ${nick}!`;
    }

    #initializeElements() {
        const MODES = ["navigation-authentication", "navigation-logout"];

        for (let i = 0; i < MODES.length; ++i) {
            this.#modesElements[i] = document.getElementById(MODES[i]);
        }

        this.#form = document.getElementById("authentication-area");
        this.#message = document.getElementById("login-message");
    }
}