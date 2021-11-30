export default class PopUp {
    #title;
    #message;
    #buttonText;
    #callback;

    constructor(title, message, buttonText, callback) {
        this.#title = title;
        this.#message = message;
        this.#buttonText = buttonText;
        this.#callback = callback;
    }

    getTitle() {
        return this.#title;
    }

    getMessage() {
        return this.#message;
    }

    getButtonText() {
        return this.#buttonText;
    }

    getCallback() {
        return this.#callback;
    }
}