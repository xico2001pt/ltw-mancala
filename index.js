"use strict";

const http = require('http');
const url = require('url');

const config = require('./server/config.js');
const authentication = require('./server/authentication.js');
const leaderboard = require('./server/leaderboard.js');
const mancala = require('./server/mancala.js');

const headers = {
    plain: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'        
    },
    sse: {    
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive'
    }
};

function writeHeaders(response, headers) {
    for (let head of Object.entries(headers)) {
        response.setHeader(head[0], head[1]);
    }
}

function serverHandlerPost(request, response, message) {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;

    switch(pathname) {
    case '/register':
        authentication.register(response, message);
        break;
    case '/ranking':
        leaderboard.ranking(response, message);
        break;
    case '/join':
        mancala.join(response, message);
        break;
    case '/leave':
        mancala.leave(response, message);
        break;
    case '/notify':
        mancala.notify(response, message);
        break;
    default:
        response.writeHead(404);
        response.write('{"error":"unknown POST request"}');
    }
    response.end();
}

function postHandler(request, response) {
    let body = '';
    request.on('data', function (data) {
        body += data;

        // Too much POST data (1KB), kill the connection!
        if (body.length > 1e3) request.connection.destroy();
    });

    request.on('end', function () {
        let message;
        try {
            message = JSON.parse(body);
        } catch {
            response.writeHead(400);
            response.write('{"error":"Error parsing JSON request: SyntaxError: Unexpected end of JSON input"}');
            response.end();
            return;
        }
        serverHandlerPost(request, response, message);
    });

    request.on('error', function(e) {
        console.log(e);
    });
}

function getHandler(request, response) {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    switch(pathname) {
    case '/update':
        mancala.addResponse(query["game"], response);
        break;
    default:
        response.writeHead(404);
        response.write('{"error":"unknown GET request"}');
        response.end();
    }
}

function main(request, response) {
    if (request.method == 'GET') {
        writeHeaders(response, headers.sse);
        getHandler(request, response);
    } else if (request.method == 'POST') {
        writeHeaders(response, headers.plain);
        postHandler(request, response);
    } else {
        response.writeHead(404);
        response.write(`{"error":"unknown ${request.method} request"}`);
        response.end();
        return;
    }
}

const server = http.createServer(main);

server.listen(config.port);
