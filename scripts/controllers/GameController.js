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
        this.#currentPlayer = +config.firstPlayer;

        this.#initializeButtons();
        this.#viewer.displayCurrentPlayer(this.#currentPlayer);
    }

    playHole(sideIdx, holeIdx) {
        if (this.#currentPlayer != sideIdx) return;  // Disable enemy holes selection
        let seeds = this.#board.getSide(sideIdx).getHole(holeIdx).getNumOfSeeds();
        if (seeds == 0) return;  // Disable empty hole selection

        this.#board.getSide(sideIdx).getHole(holeIdx).setNumOfSeeds(0);

        let side = sideIdx, hole = holeIdx + 1, lastSide, lastHole;

        while (seeds > 0) {
            lastSide = side;
            lastHole = hole;
            if (hole >= this.#board.getHolesPerSide()) {
                this.#board.getSide(side).getStorage().incrementSeed();
                side = this.#getNextSide(side);
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
        if (lastSide == this.#currentPlayer) {  // Se o ultimo buraco é do lado do jogador
            if (lastHole == this.#board.getHolesPerSide()) return;  // Se o ultimo buraco é um armazem
            else if (this.#board.getSide(lastSide).getHole(lastHole).getNumOfSeeds() == 1) {  // Se o ultimo buraco está vazio (== 1, pois a verificação é feita depois da jogada)
                let enemyHole = this.#board.getSide(this.#getNextSide(lastSide)).getHole(this.#board.getHolesPerSide() - lastHole - 1);
                let seeds = enemyHole.getNumOfSeeds();
                this.#board.getSide(lastSide).getStorage().setNumOfSeeds(this.#board.getSide(lastSide).getStorage().getNumOfSeeds() + seeds + 1);
                enemyHole.setNumOfSeeds(0);
                this.#board.getSide(lastSide).getHole(lastHole).setNumOfSeeds(0);
            }
        }

        this.#changePlayer();
        // se isGameOver(), chamar rotina gameOver()
    }

    #changePlayer() {
        this.#currentPlayer = this.#getNextSide(this.#currentPlayer)
        this.#viewer.displayCurrentPlayer(this.#currentPlayer);
    }

    #isGameOver() {
        // acaba se a soma da seeds nas storage é igual ao numero de sementes por buraco vezes o numero de buracos
        // acaba se um dos jogadores tiver o seu lado sem sementes
        // senão, n acaba
    }

    #initializeButtons() {
        // Todo: change 2
        for (let i = 0; i < 2; ++i) {
            for (let j = 0; j < this.#board.getHolesPerSide(); ++j) {
                this.#viewer.getHole(i, j).onclick = (() => this.playHole(i, j));
            }
        }
    }

    #getNextSide(side) {
        return (side + 1) % this.#board.getNumOfSides();
    }
}