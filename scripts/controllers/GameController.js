import GameViewer from "../viewers/GameViewer.js"
import Board from "../models/Board.js"

export default class GameController {
    #viewer;
    #board;
    #currentPlayer;

    constructor() {
        this.#viewer = new GameViewer();
        this.#board = null;
    }

    startGame(config) {
        this.#board = new Board(config.holesPerSide, config.seedsPerHole);
        this.#viewer.initializeBoard(config);
        this.#currentPlayer = 1;

        this.#initializeButtons();
    }

    playHole(sideIdx, holeIdx) {
        let seeds = this.#board.getSide(sideIdx).getHole(holeIdx).getNumOfSeeds();
        if (seeds == 0) return;

        this.#board.getSide(sideIdx).getHole(holeIdx).setNumOfSeeds(0);

        let side = sideIdx, hole = holeIdx + 1, lastSide, lastHole;

        while (seeds > 0) {
            lastSide = side;
            lastHole = hole;
            if (hole >= this.#board.getHolesPerSide()) {
                this.#board.getSide(side).getStorage().incrementSeed();
                side = (side + 1) % 2;
                hole = 0;
            } else {
                this.#board.getSide(side).getHole(hole).incrementSeed();
                ++hole;
            }
            --seeds;
        }

        this.#playVerification(lastSide, lastHole);
        this.#viewer.updateBoard(this.#board);
    }

    #playVerification(lastSide, lastHole) {
        console.log(lastHole);
        if (lastHole == this.#board.getHolesPerSide()) return;
        if (lastSide == this.#currentPlayer && this.#board.getSide(lastSide).getHole(lastHole).getNumOfSeeds() == 1) {
            let enemyHole = this.#board.getSide((lastSide + 1) % 2).getHole(this.#board.getHolesPerSide() - lastHole - 1);
            let seeds = enemyHole.getNumOfSeeds();
            console.log(seeds);
            this.#board.getSide(lastSide).getStorage().setNumOfSeeds(this.#board.getSide(lastSide).getStorage().getNumOfSeeds() + seeds + 1);
            enemyHole.setNumOfSeeds(0);
            this.#board.getSide(lastSide).getHole(lastHole).setNumOfSeeds(0);
        }

        //change player turn
        // check game over
    }

    #initializeButtons() {
        // Todo: change 2
        for (let i = 0; i < 2; ++i) {
            for (let j = 0; j < this.#board.getHolesPerSide(); ++j) {
                let visualJ = (i == 0 ? this.#board.getHolesPerSide() - j - 1 : j);
                this.#viewer.getHole(i, j).onclick = (() => this.playHole(i, visualJ));
            }
        }
    }
}