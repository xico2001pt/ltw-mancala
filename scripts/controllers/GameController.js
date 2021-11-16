import GameViewer from "../viewers/GameViewer.js"
import Board from "../models/Board.js"
import BoardConfiguration from "../models/BoardConfiguration.js";

export default class GameController {
    #viewer;
    #board;

    constructor() {
        this.#viewer = new GameViewer();
        this.#board = null;
    }

    startGame(config) {
        this.#board = new Board(config.holesPerSide, config.seedsPerHole);
        this.#viewer.initializeBoard(this.#board);
    }
}