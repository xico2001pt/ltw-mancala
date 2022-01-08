import Board from "../models/Board.js"

export default class BoardConfiguration {
    constructor(holesPerSide, seedsPerHole, firstPlayer) {
        this.holesPerSide = parseInt(holesPerSide);
        this.seedsPerHole = parseInt(seedsPerHole);
        this.firstPlayer =  firstPlayer;
    }

    static parseMultiplayer(data, nick) {
        let board = Board.parseMultiplayer(data["board"], nick);
        console.log(board);
        let firstPlayer = data["turn"] === nick; // TODO: NOT WORKING
        // TODO: SEED PER HOLE WRONG
        return new BoardConfiguration(board.getHolesPerSide(), parseInt(board.getTotalSeeds() / (board.getHolesPerSide()*2)), firstPlayer);
    }
}