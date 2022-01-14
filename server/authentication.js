let users = {};  // nick: password
// TODO: LOAD FILE

function validateUser(nick, password) {
    return users[nick] == password;
}

function hasUser(nick) {
    return nick in users;
}

function addUser(nick, password) {
    users[nick] = password;
    // TODO: save file
}

module.exports.register = function(request, response) {
    let header = {'Content-Type': 'application/javascript'};
    let status, body;
    // validar pedido
    // recolher dados
    // se existir user
        // se password valida
            // nice 200
        // senao
            // password invalida
    // senao
        // add à base da dados (ficheiro)
        // sucesso
    
    if (request.method != 'POST') {
        status = 400;
        body = '{"error":"unknown GET request"}';
    } else {
        let bodyJSON;
        try {
            console.log(request.body);
            bodyJSON = JSON.parse(request.body);

            if (!('nick' in bodyJSON)) {
                status = 400;
                body = '{"error":"nick is undefined"}';
            } else if (!('password' in bodyJSON)) {
                status = 400;
                body = '{"error":"password is undefined"}';
            } else {
                if (hasUser(bodyJSON[nick])) {
                    if (validateUser(bodyJSON[nick])) {
                        status = 200;
                        body = '{}';
                    }
                    else {
                        status = 400;
                        body = '{"error":"User registered with a different password"}';
                    }
                } else {
                    addUser(bodyJSON[nick], bodyJSON[password]);
                    status = 200;
                    body = '{}';
                }
            }
        } catch(e) {
            status = 400;
            body = '{"error":"Error parsing JSON request: SyntaxError: Unexpected end of JSON input"}';
        }
    }
    response.writeHead(status, header);
    response.write(body);
}