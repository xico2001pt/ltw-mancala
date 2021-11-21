import Board from "../models/Board.js"
import { instantiateDiv } from "../utils.js";

export default class GameViewer {
    #currentPlayerElement;
    #sides;
    #storages;

    constructor() {
        this.#sides = [];
        this.#storages = [];

        this.#initializeElements();
    }

    initializeBoard(config) {
        this.#clearBoard();
        for (let side of this.#sides) {
            for (let i = 0; i < config.holesPerSide; ++i) {
                let hole = instantiateDiv(side, "hole");
                for (let j = 0; j < config.seedsPerHole; ++j)
                    this.#generateSeed(hole);
            }
        }
    }

    displayCurrentPlayer(playerName) {

    }

    #clearBoard() {
        for (let side of this.#sides) side.textContent = "";
    }

    #placeSeed(hole) {
        let div = document.createElement("div");
        div.classList.add("seed");
        hole.appendChild(div);
    }

    #generateSeed(hole) {
        // generate x
        // generate y
        // generate rot
        this.#placeSeed(hole);
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