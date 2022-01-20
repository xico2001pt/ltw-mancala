const fs = require('fs');
const config = require('./config.js');

let leaderboard = [];

function loadLeaderboard() {
    fs.readFile(config.leaderboardFilepath, function(err, data) {
        if (!err) {
            leaderboard = JSON.parse(data.toString());
        }
    });
}

function saveLeaderboard() {
    fs.writeFile(config.leaderboardFilepath, JSON.stringify(leaderboard), function(err) {});
}

function getScore(nick) {
    for (var i = 0; i < leaderboard.lenght; ++i) {
        if (leaderboard[i].nick == nick) {
            return leaderboard[i];
        }
    }
    return null;
}

module.exports.addGame = function(nick, victory) {
    let score = getScore(nick);
    if (score == null) {
        score = {"nick":nick, "victories":0, "games":0};
        leaderboard.push(score);
    }
    score.games++;
    if (victory) score.victories++;
    saveLeaderboard();
}

module.exports.ranking = function(request, response, message) {
    let status, body;
    status = 200;
    body = {"ranking":leaderboard.slice(0,10)};
    response.writeHead(status);
    response.write(body);
}