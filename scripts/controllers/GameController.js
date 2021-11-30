import GameViewer from "../viewers/GameViewer.js"
import Board from "../models/Board.js"
import Player from "../models/Player.js";
import PopUpController from "../controllers/PopUpController.js"

export default class GameController {
    #viewer;
    #board;
    #players;
    #currentPlayer;
    #gameFinished;

    constructor() {
        this.#viewer = new GameViewer();
        this.#board = null;
        this.#players = [];
    }

    startGame(config, isSingleplayer) {
        this.#board = new Board(config.holesPerSide, config.seedsPerHole);
        this.#viewer.initializeBoard(config);
        this.#players[1] = new Player(1, "n00b", false);  // TODO: GET PLAYER NAME
        this.#players[0] = new Player(0, "Computer", isSingleplayer);  // TODO: GET NAME IF NOT SINGLEPLAYER
        this.#currentPlayer = +config.firstPlayer;
        this.#gameFinished = false;

        this.#initializeButtons();
        this.#viewer.displayCurrentPlayer(this.#players[this.#currentPlayer].getName());
    }

    playHole(sideIdx, holeIdx) {
        if (this.#gameFinished) return;
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
                side = GameController.#getNextSide(side);
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
        let changePlayer = true;
        if (lastSide == this.#currentPlayer) {  // Se o ultimo buraco é do lado do jogador
            if (lastHole == this.#board.getHolesPerSide()) changePlayer = false;  // Se o ultimo buraco é um armazem
            else if (this.#board.getSide(lastSide).getHole(lastHole).getNumOfSeeds() == 1) {  // Se o ultimo buraco está vazio (== 1, pois a verificação é feita depois da jogada)
                let enemyHole = this.#board.getSide(GameController.#getNextSide(lastSide)).getHole(this.#board.getHolesPerSide() - lastHole - 1);
                if (enemyHole.getNumOfSeeds() > 0) {  // Enemy hole isn't empty
                    let seeds = enemyHole.getNumOfSeeds();
                    this.#board.getSide(lastSide).getStorage().setNumOfSeeds(this.#board.getSide(lastSide).getStorage().getNumOfSeeds() + seeds + 1);
                    enemyHole.setNumOfSeeds(0);
                    this.#board.getSide(lastSide).getHole(lastHole).setNumOfSeeds(0);
                }
            }
        }

        let endgameSide = this.#isGameOver();
        if (endgameSide != null) {
            this.#gameOver(endgameSide);
            return;
        }

        if (changePlayer) this.#changePlayer();
    }

    #changePlayer() {
        this.#currentPlayer = GameController.#getNextSide(this.#currentPlayer)
        this.#viewer.displayCurrentPlayer(this.#players[this.#currentPlayer].getName());
    }

    #isGameOver() {
        for (let i = 0; i < Board.getNumOfSides(); ++i) {
            if (this.#board.getSide(i).getNumOfSeeds() == 0)
                return i;
        }
        return null;
    }

    #gameOver(endgameSide) {
        this.#gameFinished = true;

        // Recall remaining seeds to the storage
        let notEndgameSideIdx = GameController.#getNextSide(endgameSide);
        let notEndgameSide = this.#board.getSide(notEndgameSideIdx);
        if (notEndgameSide.getNumOfSeeds() > 0) {
            notEndgameSide.getStorage().setNumOfSeeds(notEndgameSide.getNumOfSeeds() + notEndgameSide.getStorage().getNumOfSeeds());
            for (let i = 0; i < notEndgameSide.getNumHoles(); ++i) {
                notEndgameSide.getHole(i).setNumOfSeeds(0);
            }
        }

        let winnerIdx = this.#getWinner();
        let winner = this.#players[winnerIdx];
        // let looser = this.#players[GameController.#getNextSide(winnerIdx)]; // TODO: talvez seja preciso para leaderboard
        
        PopUpController.instance.instantiateMessagePopUp("Game Over", 
        winner.getName() + " wins the game.\n\n" + this.#players[0].getName() + ": " + this.#players[0].getScore() + " points\n" + this.#players[1].getName() + ": " + this.#players[1].getScore() + " points\n",
        "Return", null); // TODO: NULL

        // TODO: UPDATE LEADERBOARD
    }

    #initializeButtons() {
        for (let i = 0; i < Board.getNumOfSides(); ++i) {
            for (let j = 0; j < this.#board.getHolesPerSide(); ++j) {
                this.#viewer.getHole(i, j).onclick = (() => this.playHole(i, j));
            }
        }
    }

    #getWinner() {
        // TODO: CHECK DRAW
        let player1score = this.#players[0].getScore();
        let player2score = this.#players[1].getScore();
        if (player1score > player2score) return 0;
        else return 1;
    }

    static #getNextSide(side) {
        return (side + 1) % Board.getNumOfSides();
    }
}