export default class ServerController {
    static #servers = ["http://twserver.alunos.dcc.fc.up.pt:8008/", "http://127.0.0.1:9087/"];
    static #url = ServerController.#servers[0];
    static #group = 87;
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
        ServerController.#eventSource = new EventSource(ServerController.#url+`update?nick=${nick}&game=${game}`);
        ServerController.#eventSource.onmessage = callback;
    }

    static closeEventSource() {
        if (ServerController.#eventSource) {
            ServerController.#eventSource.close();
            ServerController.#eventSource = undefined;
        }
    }

    static changeServer(isGlobal) {
        ServerController.#url = isGlobal ? ServerController.#servers[0] : ServerController.#servers[1];
    }

    static #request(path, callback, request) {
        fetch(ServerController.#url + path, request)
        .then(callback)
        .catch(console.log);
    }
}