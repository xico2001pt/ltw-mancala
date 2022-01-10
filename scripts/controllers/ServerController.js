export default class ServerController {
    static #url = "http://twserver.alunos.dcc.fc.up.pt:8008/";
    static #group = 99;
    static #eventSource;

    static ranking(callback) {
        let request = {
            method: "POST",
            body: "{}"
        }
        ServerController.#request("ranking", callback, request);
    }

    static register(nick, pass, callback) {
        let request = {
            method: "POST",
            body: JSON.stringify({"nick": nick, "password": pass})
        }
        ServerController.#request("register", callback, request);
    }

    static join(nick, pass, size, initial, callback) {
        let request = {
            method: "POST",
            body: JSON.stringify({"group": ServerController.#group, "nick": nick, "password": pass, "size": size, "initial": initial})
        }
        ServerController.#request("join", callback, request);
    }

    static leave(nick, pass, game) {
        let request = {
            method: "POST",
            body: JSON.stringify({"nick": nick, "password": pass, "game": game})
        }
        ServerController.#request("leave", () => {}, request);
    }

    static notify(nick, pass, game, move) {
        let request = {
            method: "POST",
            body: JSON.stringify({"nick": nick, "password": pass, "game": game, "move": move})
        }
        ServerController.#request("notify", () => {}, request);
    }

    static update(nick, game, callback) {
        ServerController.#eventSource = new EventSource(this.#url+`update?nick=${nick}&game=${game}`);
        ServerController.#eventSource.onmessage = callback;
    }

    static closeEventSource() {
        if (ServerController.#eventSource) {
            ServerController.#eventSource.close();
            ServerController.#eventSource = undefined;
        }
    }

    static #request(path, callback, request) {
        fetch(this.#url + path, request)
        .then(callback)
        .catch(console.log);
    }
}