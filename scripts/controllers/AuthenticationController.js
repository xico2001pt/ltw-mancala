import { changeVisibility } from "../utils.js";

export default class AuthenticationController {
    #modesContent;
    #loggedIn;

    constructor() {
        this.#modesContent = [];

        this.#initializeAuthentication();
    }

    isLoggedIn() {
        return this.#loggedIn;
    }

    register() {
        // if valid
            // create account
            // login
        this.login();
    }

    login() {
        // if valid
        this.#loggedIn = true;
        this.#updateUserArea();
    }
    
    logout() {
        this.#loggedIn = false;

        this.#updateUserArea();
    }

    #initializeAuthentication() {
        const MODES = ["navigation-authentication", "navigation-logout"];
        for (let i = 0; i < MODES.length; ++i) {
            this.#modesContent[i] = document.getElementById(MODES[i]);
        }

        document.getElementById("register-button").addEventListener("click", () => this.register());
        document.getElementById("login-button").addEventListener("click", () => this.login());
        document.getElementById("logout-button").addEventListener("click", () => this.logout());
    
        this.logout();
    }

    #updateUserArea() {
        changeVisibility(this.#modesContent[0], !this.#loggedIn);
        changeVisibility(this.#modesContent[1], this.#loggedIn);
    }
}