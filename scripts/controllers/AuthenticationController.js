import AuthenticationViewer from "../viewers/AuthenticationViewer.js";

export default class AuthenticationController {
    #viewer;
    #loggedIn;

    constructor() {
        this.#viewer = new AuthenticationViewer();
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
        this.#viewer.displayUserArea(this.#loggedIn);
    }
    
    logout() {
        this.#loggedIn = false;

        this.#viewer.displayUserArea(this.#loggedIn);
    }

    #initializeAuthentication() {
        this.logout();

        document.getElementById("register-button").addEventListener("click", () => this.register());
        document.getElementById("login-button").addEventListener("click", () => this.login());
        document.getElementById("logout-button").addEventListener("click", () => this.logout());

    }
}