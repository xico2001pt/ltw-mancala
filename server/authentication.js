const fs = require('fs');
const crypto = require('crypto');
const config = require('./config.js');

let users = {};  // users[nick] => hashed_password

function encryptPassword(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}

function loadUsers() {
    fs.readFile(config.usersFilepath, function(err, data) {
        if (!err) {
            users = JSON.parse(data.toString());
        }
    });
}

function saveUsers() {
    fs.writeFile(config.usersFilepath, JSON.stringify(users), function(err) {});
}

function validateUser(nick, password) {
    return users[nick] == encryptPassword(password);
}

module.exports.validateUser = validateUser;

function hasUser(nick) {
    return nick in users;
}

function addUser(nick, password) {
    users[nick] = encryptPassword(password);
    saveUsers();
}

module.exports.register = function(response, message) {
    let status, body;
    if (!('nick' in message)) {
        status = 400;
        body = '{"error":"nick is undefined"}';
    } else if (!('password' in message)) {
        status = 400;
        body = '{"error":"password is undefined"}';
    } else {
        if (hasUser(message["nick"])) {
            if (validateUser(message["nick"], message["password"])) {
                status = 200;
                body = '{}';
            }
            else {
                status = 400;
                body = '{"error":"user registered with a different password"}';
            }
        } else {
            addUser(message["nick"], message["password"]);
            status = 200;
            body = '{}';
        }
    }
    response.writeHead(status);
    response.write(body);
}

loadUsers();
