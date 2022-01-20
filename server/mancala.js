const authentication = require('./authentication.js');
const gameLogic = require('./game_logic.js');

let queue = {}; // Each element is [size, initial, player]
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

    protocolos:
    VALIDAR SEMPRE PEDIDO
    
    leave:
    1º - se o id estiver na fila, removemos dos jogos atuais e depois da fila
    2º - se estiver nos atuais
          - chamar UPDATE com winner = adversario
          - remover dos jogos
          - cancelar timer
          - add leaderboard
    
    notify:
    1º - atualizar o games[id]
    2º - mandar UPDATE

    update:
    1º - initUpdate(gameId) : Inicializa EventSource para o jogo
    2º - playUpdate(gameId) : manda o board, stores, .... Se o board fôr final, tmb manda winner
    3º - leaveUpdate(gameId, winner) : manda winner por desistência
*/

/*
    join:
    1º - gerar id
    2º - add id à fila de espera
    3º - add as configurações e inicializamos o board aos jogos atuais
    4º - se o segundo player se juntar, removemos da fila, atualizamos jogos atuais, começamos timer e mandamos UPDATE
    */

function generateGameId() {
    return "idk";
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
            status = 400;
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
        }
    }
    response.writeHead(status);
    response.write(body);
}