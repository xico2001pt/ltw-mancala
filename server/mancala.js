let queue = [];
let games = [];

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
    join:
    1º - gerar id
    2º - add id à fila de espera
    3º - add as configurações e inicializamos o board aos jogos atuais
    4º - se o segundo player se juntar, removemos da fila, atualizamos jogos atuais, começamos timer e mandamos UPDATE
    
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