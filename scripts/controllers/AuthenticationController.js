import AuthenticationViewer from "../viewers/AuthenticationViewer.js";
import ServerController from "./ServerController.js";
import PopUpController from "../controllers/PopUpController.js";

export default class AuthenticationController {
    #viewer;
    #loggedIn;
    #credentials;

    constructor() {
        this.#viewer = new AuthenticationViewer();
        this.#initializeAuthentication();
        this.#resetCredentials();
    }

    isLoggedIn() {
        return this.#loggedIn;
    }

    getCredentials() {
        return this.#credentials;
    }

    enter() {
        this.#credentials["nick"] = this.#viewer.getForm().nick.value;
        this.#credentials["password"] = this.#viewer.getForm().pass.value;

        ServerController.register(this.#credentials["nick"], this.#credentials["password"], this.#enterCallback.bind(this));
    }
    
    logout() {
        this.#loggedIn = false;
        this.#resetCredentials();
        this.#viewer.displayUserArea(this.#loggedIn);
    }

    async #enterCallback(response) {
        if (response.status == 200) {
            this.#logIn();
        } else {
            let message = (await response.json())["error"] + ".";
            PopUpController.instance.instantiateMessagePopUp("Authentication Error", message, "Return");
        }
    }

    #logIn() {
        this.#loggedIn = true;
        this.#viewer.displayUsername(this.#credentials["nick"]);
        this.#viewer.displayUserArea(this.#loggedIn);
    }

    #resetCredentials() {
        this.#credentials = {"nick": undefined, "password": undefined};
    }

    #initializeAuthentication() {
        this.logout();

        document.getElementById("enter-button").addEventListener("click", () => this.enter());
        document.getElementById("logout-button").addEventListener("click", () => this.logout());

    }
}