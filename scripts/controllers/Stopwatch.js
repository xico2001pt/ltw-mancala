export default class Stopwatch {
    #timeoutID;
    #defaultSeconds;
    #seconds;
    #text;
    #callback;

    constructor(seconds, text, callback) {
        this.#defaultSeconds = seconds;
        this.#text = text;
        this.#callback = callback;
        this.reset();
    }

    update() {
        this.#reduce();
        this.#text.innerText = this.toString();
        if (this.#seconds <= 0) {
            this.#callback();
            clearTimeout(this.#timeoutID);
        }
    }

    play(play) {
        if (play) this.#timeoutID = setInterval(this.update.bind(this), 1000);
        else if (this.#timeoutID) clearTimeout(this.#timeoutID);
    }

    reset() {
        if (this.#timeoutID) clearTimeout(this.#timeoutID);
        this.#timeoutID = setInterval(this.update.bind(this), 1000); 
        this.#seconds = this.#defaultSeconds;
        this.#text.innerHTML = this.toString();
    }

    toString() {
        return `${this.#seconds} seconds`;
    }

    #reduce() {
        this.#seconds = Math.max(0, this.#seconds - 1);
    }
}