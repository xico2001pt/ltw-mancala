import { changeVisibility } from "../utils.js"

export default class PopUpViewer {
    #popUpWrapper
    #title
    #message
    #button

    constructor() {
        this.#initializeElements();
        this.close();
    }

    instantiatePopUp(popUp) {
        this.#title.textContent = popUp.getTitle();
        this.#message.innerHTML = popUp.getMessage();
        this.#button.textContent = popUp.getButtonText();

        if (popUp.getCallback() != null) this.#button.addEventListener("click", popUp.getCallback());
        this.#button.addEventListener("click", () => this.close());
    }

    open() {
        changeVisibility(this.#popUpWrapper, true);
    }

    close() {
        changeVisibility(this.#popUpWrapper, false);
    }

    #initializeElements() {
        this.#popUpWrapper = document.getElementById("pop-up-wrapper");
        this.#title = document.getElementById("pop-up-title");
        this.#message = document.getElementById("pop-up-message");
        this.#button = document.getElementsByClassName("pop-up-button")[0];
    }
}