import Board from "../models/Board.js"

export default class GameViewer {
    #currentPlayerElement;
    #sides;
    #storages;

    constructor() {
        this.#sides = [];
        this.#storages = [];

        this.#initializeElements();
    }

    initializeBoard(board) {
        for (let i = 0; i < this.#sides.length; ++i) {
            
        }
        
        
        // for each side
            // for each hole
                // place hole (img) in html
                // place seeds in that hole
    }

    displayCurrentPlayer(playerName) {

    }

    #initializeElements() {
        const STORAGES = ['left', 'right'];

        for (let i = 0; i < STORAGES.length; ++i) {
            this.#storages[i] = document.getElementById(STORAGES[i] + "-storage");
        }

        this.#sides = document.getElementsByClassName("side");

        // initialize current player text
    }
}