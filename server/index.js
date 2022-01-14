"use strict";

const http = require('http');
const url = require('url');
const stream = require('stream');
const fs = require('fs');
const WebSocketServer = require('websocket').server;

const config = require('./config.js')
const authentication = require('./authentication.js');

function serverHandler(request, response, message) {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;
    response.end(message);

    switch(pathname) {
    case '/register':
        authentication.register(request, response);
        break;
    default:
        // desconhecido 404
    }
    response.end("\n");
}

function main(request, response) {
}

const server = http.createServer(() => {});

const httpServer = server.listen(9999);
const webSocketServer = new WebSocketServer({ httpServer });
webSocketServer.on('request', function(req) {
    const connection = req.accept(null, request.origin);
    remember(connection);
    connection.on('message', (message) => serverHandler(request, response, message));
    connection.on('close', function(connection) { forget(connection);});
});