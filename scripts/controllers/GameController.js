import GameViewer from "../viewers/GameViewer.js"
import Board from "../models/Board.js"
import PopUpController from "../controllers/PopUpController.js"
import { shuffle } from "../utils.js";
import ServerController from "./ServerController.js";
import Stopwatch from "../controllers/Stopwatch.js"
import AuthenticationController from "./AuthenticationController.js";
import BoardConfiguration from "../models/BoardConfiguration.js"

export default class GameController {
    static DifficultyToDepth = [1,3,6];

    #viewer;
    #gameStateController;
    #leaderboardController;
    #authenticationController;

    #stopwatch;
    #board;
    #players;
    #currentPlayer;
    #gameFinished;
    #gameId;
    #timoutID;

    constructor(gameStateController, leaderboardController, authenticationController) {
        this.#viewer = new GameViewer();
        this.#stopwatch = new Stopwatch(5, this.#viewer.getStopwatch(), this.#timeoutLeave.bind(this));
        this.#stopwatch.play(false);
        this.#gameStateController = gameStateController;
        this.#leaderboardController = leaderboardController;
        this.#authenticationController = authenticationController;
        this.#board = null;
        this.#players = [];
    }

    multiplayerCallback(event) {
        /*
        if on menu
            start game with given configs
        else
            playHole?
        */
    }

    startGame(config, players, gameId=null) {
        this.#stopwatch.reset();
        this.#board = new Board(config.holesPerSide, config.seedsPerHole);
        this.#viewer.initializeBoard(config);
        this.#players[1] = players[1];
        this.#players[0] = players[0];
        this.#currentPlayer = +config.firstPlayer;
        this.#gameFinished = false;
        this.#gameId;

        this.#initializeButtons();
        this.#viewer.displayCurrentPlayer(this.#players[this.#currentPlayer].getName());

        if (GameController.#isEnemyPlayer(this.#currentPlayer)) this.#opponentPlay();
    }

    #playHole(board, sideIdx, holeIdx) {
        let seeds = board.getSide(sideIdx).getHole(holeIdx).getNumOfSeeds();
        if (seeds <= 0) return null;  // Disable empty hole selection

        board.getSide(sideIdx).getHole(holeIdx).setNumOfSeeds(0);

        let side = sideIdx, hole = holeIdx + 1, lastSide, lastHole;

        while (seeds > 0) {
            lastSide = side;
            lastHole = hole;
            if (hole >= board.getHolesPerSide()) {
                board.getSide(side).getStorage().incrementSeed();
                side = GameController.#getNextSide(side);
                hole = 0;
            } else {
                board.getSide(side).getHole(hole).incrementSeed();
                ++hole;
            }
            --seeds;
        }

        return [lastSide, lastHole];
    }

    playHoleHuman(sideIdx, holeIdx) {
        if (this.#gameFinished) return;
        if (GameController.#isEnemyPlayer(this.#currentPlayer)) return;  // Disable moves in enemy turn
        if (this.#currentPlayer != sideIdx) return;  // Disable enemy holes selection

        let result = this.#playHole(this.#board, sideIdx, holeIdx);
        if (result == null) return;

        this.#playVerificationOriginal(result[0], result[1]);
        this.#viewer.updateBoard(this.#board);
        if (!this.#players[0].getIsBot())
            ServerController.notify(this.#authenticationController.getCredentials()["nick"], this.#authenticationController.getCredentials()["pass"], this.#gameId, holeIdx);
    }

    #playVerification(board, lastSide, lastHole, currentPlayer) {
        if (lastSide == currentPlayer) {  // Se o ultimo buraco é do lado do jogador
            if (lastHole == board.getHolesPerSide()) return false;  // Se o ultimo buraco é um armazem
            else if (board.getSide(lastSide).getHole(lastHole).getNumOfSeeds() == 1) {  // Se o ultimo buraco está vazio (== 1, pois a verificação é feita depois da jogada)
                let enemyHole = board.getSide(GameController.#getNextSide(lastSide)).getHole(board.getHolesPerSide() - lastHole - 1);
                if (enemyHole.getNumOfSeeds() > 0) {  // Enemy hole isn't empty
                    let seeds = enemyHole.getNumOfSeeds();
                    board.getSide(lastSide).getStorage().setNumOfSeeds(board.getSide(lastSide).getStorage().getNumOfSeeds() + seeds + 1);
                    enemyHole.setNumOfSeeds(0);
                    board.getSide(lastSide).getHole(lastHole).setNumOfSeeds(0);
                }
            }
        }
        return true;
    }

    #playVerificationOriginal(lastSide, lastHole) {
        let changePlayer = this.#playVerification(this.#board, lastSide, lastHole, this.#currentPlayer);

        let endgameSide = this.#isGameOver(this.#board);
        if (endgameSide != null) {
            this.#gameOver(endgameSide);
            return;
        }

        if (changePlayer) this.#changePlayer();
        this.#stopwatch.reset();
    }

    #changePlayer() {
        this.#currentPlayer = GameController.#getNextSide(this.#currentPlayer);
        this.#viewer.displayCurrentPlayer(this.#players[this.#currentPlayer].getName());

        if (GameController.#isEnemyPlayer(this.#currentPlayer)) this.#opponentPlay();
    }

    #computerPlay() {
        let hole = this.#minimax(this.#board, GameController.DifficultyToDepth[this.#players[this.#currentPlayer].getDifficulty()], true)[1];
        let result = this.#playHole(this.#board, 0, hole);
        this.#playVerificationOriginal(result[0], result[1]);
        this.#viewer.updateBoard(this.#board);

        if (GameController.#isEnemyPlayer(this.#currentPlayer) && !this.#gameFinished) this.#opponentPlay();
    }

    #opponentPlay() {
        if (this.#players[this.#currentPlayer].getIsBot()) {
            this.#timoutID = setTimeout(() => this.#computerPlay(), 2000);  // TODO: randomize time
        }
        // if human
    }

    #minimax(board, depth, maximize) {
        // If no more moves will be simulated or the game is over
        if (depth == 0 || this.#isGameOver(board) != null) {
            if (maximize) return [board.getSide(0).getStorage().getNumOfSeeds(), -1];
            else return [board.getSide(1).getStorage().getNumOfSeeds(), -1];
        }

        let alpha;  // Optimized score
        let bestHole = -1;
        let copyBoard;  // Board used to simulate moves

        let current;
        let changePlayer;
        // Maximize the score (current player is the AI)
        if (maximize) {
            alpha = -Infinity;

            // Simulate every possible move
            for (let hole of GameController.#randomHoleOrder(board.getHolesPerSide())) {
                console.log(hole);
                // If it's a valid move
                if (board.getSide(0).getHole(hole).getNumOfSeeds() > 0) {
                    copyBoard = board.copy();
                    let result = this.#playHole(copyBoard, 0, hole);
                    changePlayer = this.#playVerification(copyBoard, result[0], result[1], 0);

                    current = this.#minimax(copyBoard, depth-1, !changePlayer)[0];
                    if (current > alpha) {
                        alpha = current;
                        bestHole = hole;
                    }
                }
            }
        }

        // Minimize opponent's score
        else {
            alpha = +Infinity;

            // Simulate every possible move
            for (let hole of GameController.#randomHoleOrder(board.getHolesPerSide())) {
                // If it's a valid move
                if (board.getSide(1).getHole(hole).getNumOfSeeds() > 0) {
                    copyBoard = board.copy();
                    let result = this.#playHole(copyBoard, 1, hole);
                    changePlayer = this.#playVerification(copyBoard, result[0], result[1], 1);

                    current = this.#minimax(copyBoard, depth-1, changePlayer)[0];
                    if (current < alpha) {
                        alpha = current;
                        bestHole = hole;
                    };
                }
            }
        }

        return [alpha, bestHole];
    }

    static #randomHoleOrder(numHoles) {
        return shuffle(Array.from(Array(numHoles).keys()));
    }

    #isGameOver(board) {
        for (let i = 0; i < Board.getNumOfSides(); ++i) {
            if (board.getSide(i).getNumOfSeeds() == 0)
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

        // Update players score
        this.#players[0].setScore(this.#board.getSide(0).getStorage().getNumOfSeeds());
        this.#players[1].setScore(this.#board.getSide(1).getStorage().getNumOfSeeds());

        let winnerIdx = this.#getWinner();
        let winner = this.#players[winnerIdx];
        
        this.#endGame(winner);
    }

    #endGame(winner) {
        this.#stopwatch.play(false);
        if (this.#timoutID) {
            clearTimeout(this.#timoutID);
            this.#timoutID = undefined;
        }
        PopUpController.instance.instantiateMessagePopUp("Game Over", 
        winner.getName() + " wins the game.<br><br>" + this.#players[0].getName() + ": " + this.#players[0].getScore() + " points<br>" + this.#players[1].getName() + ": " + this.#players[1].getScore() + " points",
        "Return", () => this.#gameStateController.exitGame());

        if (this.#players[0].getIsBot()) this.#leaderboardController.addGame(this.#players[1].getName(), this.#players[1] == winner);
    }

    #giveUp(winnerIdx) {
        let winner = this.#players[winnerIdx];
        let looser = this.#players[GameController.#getNextSide(winnerIdx)];
        winner.setScore(this.#board.getTotalSeeds());
        looser.setScore(0);
        this.#endGame(winner);

        if (!this.#players[0].getIsBot())
            ServerController.leave(this.#authenticationController.getCredentials()["nick"], this.#authenticationController.getCredentials()["pass"], this.#gameId);
    }

    #timeoutLeave() {
        this.#giveUp(GameController.#getNextSide(this.#currentPlayer));
    }

    #initializeButtons() {
        for (let hole = 0; hole < this.#board.getHolesPerSide(); ++hole) {
                this.#viewer.getHole(1, hole).onclick = (() => this.playHoleHuman(1, hole));
        }

        document.getElementById("leave-game-button").addEventListener("click", () => this.#giveUp(0));
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

    static #isEnemyPlayer(side) {
        return side == 0;
    }
}