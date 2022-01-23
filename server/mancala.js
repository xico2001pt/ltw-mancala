const authentication = require('./authentication.js');
const gameLogic = require('./game_logic.js');
const leaderboard = require('./leaderboard.js');
const crypto = require('crypto');

let queue = {};  // queue[gameId] => [size, initial, player]
let games = {};
let responses = {}  // responses[gameId]] => [response1, response2]

function generateGameId() {
    let gameId;
    do {
        gameId = Date.now().toString();
        gameId = crypto.createHash('md5').update(gameId).digest('hex');
    } while (gameId in queue || gameId in games);
    return gameId;
}

function searchGame(size, initial) {
    for (let game of Object.entries(queue)) { // game[0] = gameId, game[1] = [size, intial, player]
        if (game[1][0] == size && game[1][1] == initial) return game[0];
    }
    return null;
}

function updateResponses(gameId, message) {
    if (gameId in responses) {
        for (let response of responses[gameId]) {
            response.write('data: ' + JSON.stringify(message) + '\n\n');
        }
    }
}

function endResponses(gameId) {
    if (gameId in responses) {
        for (let response of responses[gameId]) {
            response.end();
        }
        delete responses[gameId];
    }
}

module.exports.join = function(response, message) {
    let status, body;
    if (!('nick' in message)) {
        status = 400;
        body = '{"error":"nick is undefined"}';
    } else if (!('password' in message)) {
        status = 400;
        body = '{"error":"password is undefined"}';
    } else if (!('group' in message)) {
        status = 400;
        body = '{"error":"group is undefined"}';
    } else if (!('size' in message)) {
        status = 400;
        body = '{"error":"size is undefined"}';
    } else if (!('initial' in message)) {
        status = 400;
        body = '{"error":"initial is undefined"}';
    } else {
        if (!authentication.validateUser(message["nick"], message["password"])) {
            status = 401;
            body = '{"error":"invalid password"}';
        } else if (parseInt(message["size"]) <= 0) {
            status = 400;
            body = '{"error":"invalid size"}';
        } else if (parseInt(message["initial"]) <= 0) {
            status = 400;
            body = '{"error":"invalid initial"}';
        } else {
            let gameId = searchGame(parseInt(message["size"]), parseInt(message["initial"]));
            if (gameId == null) {
                gameId = generateGameId();
                queue[gameId] = [parseInt(message["size"]), parseInt(message["initial"]), message["nick"]];
            } else {
                let game = gameLogic.initGame(parseInt(message["size"]), parseInt(message["initial"]), [message["nick"], queue[gameId][2]], queue[gameId][2]);
                games[gameId] = game;
                delete queue[gameId];
            }
            status = 200;
            body = JSON.stringify({"game": gameId});
        }
    }
    response.writeHead(status);
    response.write(body);
}
    
module.exports.leave = function(response, message) {
    let status, body;
    if (!('nick' in message)) {
        status = 400;
        body = '{"error":"nick is undefined"}';
    } else if (!('password' in message)) {
        status = 400;
        body = '{"error":"password is undefined"}';
    } else if (!('game' in message)) {
        status = 400;
        body = '{"error":"game is undefined"}';
    } else {
        if (!authentication.validateUser(message["nick"], message["password"])) {
            status = 401;
            body = '{"error":"invalid password"}';
        } else if (message["game"] in queue) {
            if (message["nick"] != queue[message["game"]][2]) {
                status = 400;
                body = '{"error":"game must be cancelled by the original player"}';
            } else {
                updateResponses(message["game"], {"winner":null});
                endResponses(message["game"]);
                delete queue[message["game"]];
                status = 200;
                body = '{}';
            }
        } else if (message["game"] in games) {
            let players = gameLogic.getPlayers(games[message["game"]]);
            if (message["nick"] != players[0] && message["nick"] != players[1]) {
                status = 400;
                body = '{"error":"game must be left by the original players"}';
            } else {
                let winner = gameLogic.opponentPlayer(message["nick"], games[message["game"]]["board"]["sides"]);
                updateResponses(message["game"], {"winner":winner});
                endResponses(message["game"]);
                leaderboard.addGame(winner, true);
                leaderboard.addGame(message["nick"], false);
                delete games[message["game"]];
                status = 200;
                body = '{}';
            }
        } else {
            status = 400;
            body = '{"error":"invalid game"}';
        }
    }
    response.writeHead(status);
    response.write(body);
}

module.exports.notify = function(response, message) {
    let status, body;
    if (!('nick' in message)) {
        status = 400;
        body = '{"error":"nick is undefined"}';
    } else if (!('password' in message)) {
        status = 400;
        body = '{"error":"password is undefined"}';
    } else if (!('game' in message)) {
        status = 400;
        body = '{"error":"game is undefined"}';
    } else if (!('move' in message)) {
        status = 400;
        body = '{"error":"move is undefined"}';
    } else {
        if (!authentication.validateUser(message["nick"], message["password"])) {
            status = 401;
            body = '{"error":"invalid password"}';
        } else if (!(message["game"] in games)) {
            status = 400;
            body = '{"error":"invalid game"}';
        } else {
            let game = games[message["game"]];
            let board = game["board"];
            if (parseInt(message["move"]) < 0 || parseInt(message["move"]) >= board["sides"][board["turn"]]["pits"].length) {
                status = 400;
                body = '{"error":"invalid move"}';
            } else if (board["turn"] != message["nick"]) {
                status = 400;
                body = '{"error":"Not your turn to play"}';
            } else {
                let gameId = message["game"];
                let winner = gameLogic.playHole(game, parseInt(message["move"]));
                let finalResponse = JSON.parse(JSON.stringify(game));
                if (winner) {
                    let players = gameLogic.getPlayers(game);
                    leaderboard.addGame(players[0], players[0] === winner["winner"]);
                    leaderboard.addGame(players[1], players[1] === winner["winner"]);
                    finalResponse["winner"] = winner["winner"];
                    updateResponses(gameId, finalResponse);
                    endResponses(gameId);
                    delete games[gameId];
                } else {
                    updateResponses(gameId, finalResponse);
                }
                status = 200;
                body = '{}';
            }
        }
    }
    response.writeHead(status);
    response.write(body);
}

module.exports.addResponse = function(gameId, response) {
    if (!(gameId in responses)) {
        responses[gameId] = [];
    }
    responses[gameId].push(response);
    if (responses[gameId].length == 2) {
        updateResponses(gameId, games[gameId]);
    }
}