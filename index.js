"use strict";

const http = require('http');
const url = require('url');
const stream = require('stream');
const fs = require('fs');

const config = require('./server/config.js');
const authentication = require('./server/authentication.js');
const mancala = require('./server/mancala.js');

const headers = {
    'Content-Type': 'application/javascript',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*'
}

function writeHeaders(response) {
    for (let head of Object.entries(headers)) {
        response.setHeader(head[0], head[1]);
    }
}

function serverHandlerPost(request, response, message) {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;

    switch(pathname) {
    case '/register':
        authentication.register(request, response, message);
        break;
    case '/ranking':
        break;
    case '/join':
        break;
    case '/leave':
        break;
    case '/notify':
        break;
    default:
        response.writeHead(404);
        response.write('{"error":"unknown POST request"}');
    }
    response.end("\n");
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
            console.log("body:", body);
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

function main(request, response) {
    console.log("hey");
    writeHeaders(response);
    if (request.method == 'GET') {

    } else if (request.method == 'POST') {
        postHandler(request, response);
    } else {
        // TODO: 404 '{"error":"unknown request.method request"}'
    }
}

const server = http.createServer(main);

server.listen(config.port);
