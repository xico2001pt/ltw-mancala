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
*/
function isEmptySide(pits) {
    let count = 0;
    for (let seeds of Object.values(pits)) count += seeds;
    return count === 0;
}

function isGameOver(sides) {
    for (let side of Object.values(sides)) {
        if (isEmptySide(side["pits"]))
            return true
    }
    return false;
}

function updateOutsideStores(sides, stores) {
    for (let store of Object.entries(stores))
        stores[store[0]] = sides[store[0]]["store"];
}

function cleanSides(sides, stores) {
    for (let side of Object.values(sides)) {
        for (let i = 0; i < side["pits"].length; ++i) {
            side["store"] += side["pits"][i];
            side["pits"][i] = 0;
        }
    }
    updateOutsideStores(sides, stores);
}

function getPlayers(game) {
    let names = [];
    for (let store of Object.entries(game["stores"])) names.push(store[0]);
    return names;
}

module.exports.getPlayers = getPlayers;

function gameOver(game) {
    let board = game["board"];
    let stores = game["stores"];
    cleanSides(board["sides"], stores);

    let names = getPlayers(game)

    if (stores[names[0]] == stores[names[1]]) return null;
    else if (stores[names[0]] > stores[names[1]]) return names[0];
    else return names[1];
}

function opponentPlayer(player, sides) {
    for (let name in sides)
        if (name !== player) {
            return name;
        }
    return null;
}

module.exports.opponentPlayer = opponentPlayer;

function changePlayer(board) {
    board["turn"] = opponentPlayer(board["turn"], board["sides"]);
}

function playVerification(game, lastSide, lastHole) {
    let board = game["board"];
    let currentPlayer = board["turn"];
    let holesPerSide = board["sides"][currentPlayer]["pits"].length;
    let canChangePlayer = true;
    console.log(lastSide, lastHole, currentPlayer, holesPerSide);
    if (lastSide === currentPlayer) {  // If last hole is on player's side
        if (lastHole == holesPerSide) canChangePlayer = false;  // If last hole is storage
        else if (board["sides"][currentPlayer]["pits"][lastHole] == 1) {  // If last hole is empty (== 1, verification is done after the move)
            let opponent = opponentPlayer(board["turn"], board["sides"]);
            let enemyHoleIdx = holesPerSide - lastHole - 1;
            let enemyHole = board["sides"][opponent]["pits"][enemyHoleIdx];
            if (enemyHole > 0) {
                board["sides"][currentPlayer]["store"] += enemyHole + 1;
                game["stores"][currentPlayer] = board["sides"][currentPlayer]["store"];

                board["sides"][opponent]["pits"][enemyHoleIdx] = 0;
                board["sides"][currentPlayer]["pits"][lastHole] = 0;
            }
        }
    }

    if (isGameOver(board["sides"])) {
        return {"winner":gameOver(game)};
    }

    if (canChangePlayer) changePlayer(board);
    return null;
}

function generatePit(numHoles, numSeeds) {
    let pit = [];
    while (numHoles != 0) {
        pit.push(numSeeds);
        numHoles--;
    }
    return pit;
}

function generateSides(players, numHoles, numSeeds) {
    let result = {};
    result[players[0]] = {};
    result[players[0]]["store"] = 0;
    result[players[0]]["pits"] = generatePit(numHoles, numSeeds);
    result[players[1]] = {};
    result[players[1]]["store"] = 0;
    result[players[1]]["pits"] = generatePit(numHoles, numSeeds);
    return result;
}

function generateStores(players) {
    result = {};
    result[players[0]] = 0;
    result[players[1]] = 0;
    return result;
}

module.exports.initGame = function(numHoles, numSeeds, players, starterPlayer) {
    return {
        "board":
        {
            "turn":starterPlayer,
            "sides": generateSides(players, numHoles, numSeeds)
        },
        "stores": generateStores(players)
    };
}

module.exports.playHole = function(game, holeIdx) {
    let board = game["board"];
    let sideOwner = board["turn"];
    let side = board["sides"][sideOwner];
    let seeds = side["pits"][holeIdx];
    let holesPerSide = side["pits"].length
    let hole = holeIdx + 1;

    let lastSide, lastHole;

    side["pits"][holeIdx] = 0;

    while (seeds > 0) {
        lastSide = sideOwner;
        lastHole = hole;
        if (hole >= holesPerSide) {
            board["sides"][sideOwner]["store"]++;
            game["stores"][sideOwner]++;
            sideOwner = opponentPlayer(sideOwner, board["sides"]);
            side = board["sides"][sideOwner];
            hole = 0;
        } else {
            side["pits"][hole]++;
            hole++;
        }
        seeds--;
    }
    return playVerification(game, lastSide, lastHole);
}



