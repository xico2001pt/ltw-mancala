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
            for (let j = 0; j < board.getSide(i).getNumHoles; ++j) {
                var div = document.createElement("div");
                div.classList.add("hole");
                side.appendChild(div);
                for (let k = 0; k < board.getSide(i).getHole(j).getNumOfSeeds(); ++k) {
                    this.#generateSeed(div);
                }
            }
        }
    }

    #placeSeed(hole, x, y, rot) {
        var div = document.createElement("div");
        div.classList.add("seed");
        hole.appendChild(div);
    }

    #generateSeed(hole) {
        // generate x
        // generate y
        // generate rot
        this.#placeSeed(hole, x, y, rot);
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