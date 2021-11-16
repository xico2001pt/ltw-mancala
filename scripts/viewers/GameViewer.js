import Board from "../models/Board.js"

export default class GameViewer {
    #currentPlayerElement;
    #sides;
    #holes;

    constructor() {
        this.#sides = [];
        this.#holes = [];

        this.#initializeElements();
    }

    initializeBoard(board) {
        // for each side
            // for each hole
                // place hole (img) in html
                // place seeds in that hole
    }

    displayCurrentPlayer(playerName) {

    }

    #initializeElements() {
        // initialize current player text
        // initialize sides elements
    }
}