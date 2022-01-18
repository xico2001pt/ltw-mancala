/*
    fila de espera ["iir89idn3"]
    obj com jogos atuais {"a5f282": obj parte 2}
    funções de logica de jogo

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