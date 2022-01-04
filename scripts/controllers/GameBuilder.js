import GameBuilderViewer from "../viewers/GameBuilderViewer.js";
import BoardConfiguration from "../models/BoardConfiguration.js"
import Player from "../models/Player.js";
import ServerController from "./ServerController.js";
import PopUpController from "./PopUpController.js";

export default class GameBuilder {
    #viewer;
    #gameStateController;
    #gameController;
    #authenticationController;

    #form;
    #isSingleplayer;

    constructor(gameStateController, gameController, authenticationController) {
        this.#viewer = new GameBuilderViewer();
        this.#gameStateController = gameStateController;
        this.#gameController = gameController;
        this.#authenticationController = authenticationController;
        this.#initialize();
        this.#changeMode(true);
    }

    setUpGame() {
        if (this.#isSingleplayer) {
            let playerNick = this.#authenticationController.isLoggedIn() ? this.#authenticationController.getCredentials()["nick"] : "Guest";
            let players = [new Player("Computer", this.#form.difficulty.value), new Player(playerNick , -1)];
            this.#startGame(players);
        } else {
            if (!this.#assertAuthentication()) {
                this.#changeMode(true);
                return;
            }
            let credentials = this.#authenticationController.getCredentials();
            ServerController.join(credentials["nick"], credentials["password"], this.#form.holesPerSide.value, this.#form.seedsPerHole.value, this.#multiplayerCallback.bind(this));
        }
    }

    async #multiplayerCallback(response) {
        let responseJSON = await response.json();
        if (response.status == 200) {
            let credentials = this.#authenticationController.getCredentials();
            PopUpController.instance.instantiateMessagePopUp("Matchmaking Status", "Waiting for opponent.<br>Game Id: " + responseJSON["game"], "Cancel", 
            () => ServerController.leave(credentials["nick"], credentials["password"], responseJSON["game"]));
        } else {
            let message = response["error"] + ".";
            PopUpController.instance.instantiateMessagePopUp("Matchmaking Error", message, "Return");
        }
    }

    #startGame(players) {
        let holesPerSide = this.#form.holesPerSide.value;
        let seedsPerHole = this.#form.seedsPerHole.value;
        let playFirst = this.#form.playFirst.checked;
        let config = new BoardConfiguration(holesPerSide, seedsPerHole, playFirst);
        
        this.#gameController.startGame(config, players);
        this.#gameStateController.startGame();
    }

    #changeMode(isSingleplayer) {
        if (!isSingleplayer && !this.#assertAuthentication()) return;

        this.#isSingleplayer = isSingleplayer;
        this.#viewer.changeMode(isSingleplayer);
    }

    #assertAuthentication() {
        if (!this.#authenticationController.isLoggedIn()) {
            PopUpController.instance.instantiateMessagePopUp("Permission Denied", "You need to authenticate in order to access multiplayer content.", "Return");
            return false;
        }
        return true;
    }

    #initialize() {
        this.#form = document.getElementById("game-config");


        document.getElementById("start-game-button").addEventListener("click", () => this.setUpGame());
        this.#viewer.getSingleplayerButton().addEventListener("click", () => this.#changeMode(true));
        this.#viewer.getMultiplayerButton().addEventListener("click", () => this.#changeMode(false));
    }
}