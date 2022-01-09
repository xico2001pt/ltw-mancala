import Board from "../models/Board.js"

export default class BoardConfiguration {
    constructor(holesPerSide, seedsPerHole, firstPlayer) {
        this.holesPerSide = parseInt(holesPerSide);
        this.seedsPerHole = parseInt(seedsPerHole);
        this.firstPlayer =  firstPlayer;
    }

    static parseMultiplayer(data, nick) {
        let board = Board.parseMultiplayer(data["board"], nick);
        let firstPlayer = (data["board"]["turn"] == nick);
        return new BoardConfiguration(board.getHolesPerSide(), parseInt(board.getTotalSeeds() / (board.getHolesPerSide()*2)), firstPlayer);
    }
}