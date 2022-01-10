import Board from "../models/Board.js"
import { instantiateDiv } from "../utils.js";

export default class GameViewer {
    #currentPlayerElement;
    #stopwatch;
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
        for (let i = 0; i < config.holesPerSide; ++i) this.#sides[1].childNodes[i].classList.add("selectable-hole");
    }

    displayCurrentPlayer(playerName) {
        this.#currentPlayerElement.textContent = "Current Player: " + playerName; 
    }

    getStopwatch() {
        return this.#stopwatch;
    }

    getHole(sideIdx, holeIdx) {
        let holes = this.#sides[sideIdx].childNodes;
        return holes[sideIdx == 0 ? holes.length - holeIdx - 1 : holeIdx];
    }

    updateBoard(board) {
        for (let i = 0; i < Board.getNumOfSides(); ++i) {
            for (let j = 0; j < board.getHolesPerSide(); ++j) {
                this.#updateHole(this.getHole(i, j), board.getSide(i).getHole(j).getNumOfSeeds());
            }
            this.#updateHole(this.#storages[i], board.getSide(i).getStorage().getNumOfSeeds());
        }
    }

    #updateHole(hole, newNumOfSeeds) {
        let currentSeeds = hole.childNodes.length;

        if (newNumOfSeeds > currentSeeds) for (let i = 0; i < newNumOfSeeds - currentSeeds; ++i) this.#generateSeed(hole);
        else if (newNumOfSeeds < currentSeeds) for (let i = 0; i < currentSeeds - newNumOfSeeds; ++i) hole.firstChild.remove();
    }

    #clearBoard() {
        for (let side of this.#sides) side.textContent = "";
        for (let storage of this.#storages) storage.textContent = "";
    }

    #placeSeed(hole) {
        let div = document.createElement("div");
        div.classList.add("seed");
        hole.appendChild(div);
    }

    #generateSeed(hole) {
        // TODO: generate x
        // TODO: generate y
        // TODO: generate rot
        this.#placeSeed(hole);
    }

    #initializeElements() {
        const STORAGES = ['left', 'right'];
        for (let i = 0; i < STORAGES.length; ++i) {
            this.#storages[i] = document.getElementById(STORAGES[i] + "-storage");
        }

        this.#sides = document.getElementsByClassName("side");

        this.#currentPlayerElement = document.getElementById("current-player");
        this.#stopwatch = document.getElementById("game-stopwatch");
    }
}