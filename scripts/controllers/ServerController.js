export default class ServerController {
    static url = "http://twserver.alunos.dcc.fc.up.pt:8008/";

    static #request(path, callback, request=null) {
        // TODO: IMPROVE CODE STRUCTURE
        let promise;
        if (request) promise = fetch(url + path, request);
        else promise = fetch(url + path);
        
        promise
        .then(callback)
        .catch(console.log);
    }

    static ranking(callback) {
        ServerController.request("ranking", callback);
    }
}