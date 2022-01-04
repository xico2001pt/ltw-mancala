export default class ServerController {
    static #url = "http://twserver.alunos.dcc.fc.up.pt:8008/";
    static #group = 99;

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

    static leave(nick, pass, game, callback) {
        let request = {
            method: "POST",
            body: JSON.stringify({"nick": nick, "pass": pass, "game": game})
        }
        ServerController.#request("leave", callback, request);
    }

    static notify(nick, pass, game, move, callback) {
        let request = {
            method: "POST",
            body: JSON.stringify({"nick": nick, "pass": pass, "game": game, "move": move})
        }
        ServerController.#request("notify", callback, request);
    }

    static #request(path, callback, request=null) {
        // TODO: IMPROVE CODE STRUCTURE
        let promise;
        if (request) promise = fetch(this.#url + path, request);
        else promise = fetch(this.#url + path);
        
        promise
        .then(callback)
        .catch(console.log);
    }
}