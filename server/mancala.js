const authentication = require('./authentication.js');
const gameLogic = require('./game_logic.js');
const crypto = require('crypto');

let queue = {};  // queue[gameId] => [size, initial, player]
let games = {};

/*
    /*
        {
        "board":
        {
            "turn":"x234567",
            "sides":
            {
                "x234567":
                {
                    "store":0,
                    "pits":[4,4,4,4,4]
                },
                "x23456":
                {
                    "store":0,
                    "pits":[4,4,4,4,4]
                }
            }
        }
        ,"stores":
        {
            "x234567":0,
            "x23456":0
        }
        }

    update:
    1º - initUpdate(gameId) : Inicializa EventSource para o jogo
    2º - playUpdate(gameId) : manda o board, stores, .... Se o board fôr final, tmb manda winner
    3º - leaveUpdate(gameId, winner) : manda winner por desistência
*/

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

module.exports.join = function(request, response, message) {
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
            // TODO: call update?
            status = 200;
            body = JSON.stringify({"game": gameId});
        }
    }
    response.writeHead(status);
    response.write(body);
}
    
module.exports.leave = function(request, response, message) {
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
                delete queue[message["game"]];
                status = 200;
                body = '{}';
            }
        } else if (message["game"] in games) {
            let players = getPlayers(games[message["game"]]);
            if (message["nick"] != players[0] && message["nick"] != players[1]) {
                status = 400;
                body = '{"error":"game must be left by the original players"}';
            } else {
                // TODO: call update
                // TODO: add leaderboard
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

module.exports.notify = function(request, response, message) {
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
                let isGameOver = gameLogic.playHole(game, parseInt(message["move"]));
                if (isGameOver) {
                    // TODO: SEND UPDATE WITH WINNER IN OBJ
                    delete games[gameId];
                } else {
                    // TODO: SEND UPDATE
                }
                status = 200;
                body = '{}';
            }
        }
    }
    response.writeHead(status);
    response.write(body);
}