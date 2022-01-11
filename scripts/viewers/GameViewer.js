import Board from "../models/Board.js"
import { instantiateDiv, randomInt } from "../utils.js";

export default class GameViewer {
    #currentPlayerElement;
    #scoreboard;
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

    displayCurrentScore(board, players, usePlayers=false) {
        let scores = [];
        if (usePlayers) {
            scores[0] = players[0].getScore();
            scores[1] = players[1].getScore();
        } else {
            scores[0] = board.getSide(0).getStorage().getNumOfSeeds();
            scores[1] = board.getSide(1).getStorage().getNumOfSeeds();
        }
        this.#scoreboard.innerHTML = `<p>${players[1].getName()}: ${scores[1]} points</p><p>${players[0].getName()}: ${scores[0]} points</p>`;
    }

    getStopwatch() {
        return this.#stopwatch;
    }

    getHole(sideIdx, holeIdx) {
        let holes = this.#sides[sideIdx].childNodes;
        return holes[sideIdx == 0 ? holes.length - holeIdx - 1 : holeIdx];
    }

    updateGame(board, players) {
        this.updateBoard(board);
        this.displayCurrentScore(board, players);
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
        return div;
    }

    #generateSeed(hole) {
        let seed = this.#placeSeed(hole);

        let x = `${randomInt(10, 60)}%`;
        let y = `${randomInt(10, 80)}%`;
        let rot = `${randomInt(0, 180)}deg`

        seed.style.left = x;
        seed.style.top = y;
        seed.style.transform = `rotate(${rot})`;
    }

    #initializeElements() {
        const STORAGES = ['left', 'right'];
        for (let i = 0; i < STORAGES.length; ++i) {
            this.#storages[i] = document.getElementById(STORAGES[i] + "-storage");
        }

        this.#sides = document.getElementsByClassName("side");

        this.#currentPlayerElement = document.getElementById("current-player");
        this.#stopwatch = document.getElementById("game-stopwatch");
        this.#scoreboard = document.getElementById("scoreboard");
    }
}