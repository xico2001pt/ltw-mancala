export default class ServerController {
    static #url = "http://twserver.alunos.dcc.fc.up.pt:8008/";

    static ranking(callback) {
        ServerController.request("ranking", callback);
    }

    static register(nick, pass, callback) {
        let request = {
            method: "POST",
            body: ServerController.#parseJSON(["nick", "password"], [nick, pass])
        }
        ServerController.#request("register", callback, request);
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

    static #parseJSON(args, values) {
        let res = {};
        for (let i = 0; i < args.length; ++i) {
            res[args[i]] = values[i];
        }
        return JSON.stringify(res);
    }

    /*
    static #parseURLEncoded(args, values) {
        let res = [];
        for (let i = 0; i < args.length; ++i) {
            res[i]= `${args[i]}=${values[i]}`;
        }
        return res.join('&');
    }
    */
}