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
    #gameID;

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

    multiplayerCallback(event) {
        let data = event.data;
        console.log(data);
        let dataJSON = JSON.parse(data);
        if (this.#gameStateController.isMenu()) {
            PopUpController.instance.forceClosePopUp();
            if ("winner" in dataJSON) {
                ServerController.closeEventSource();
                return;
            }
            this.#gameStateController.startGame();

            let playerNick = this.#authenticationController.getCredentials()["nick"];
            let config = BoardConfiguration.parseMultiplayer(dataJSON, playerNick);
            let opponentName;
            for (let name of Object.keys(dataJSON["stores"])) if (name !== playerNick) opponentName = name;
            let players = [new Player(opponentName, -1), new Player(playerNick , -1)];

            console.log(config);
            this.#gameController.startGame(config, players, this.#gameID);
        } else {
            this.#gameController.multiplayerCallback(dataJSON);
        }
    }

    async #multiplayerCallback(response) {
        let responseJSON = await response.json();
        if (response.status == 200) {
            let credentials = this.#authenticationController.getCredentials();
            this.#gameID = responseJSON["game"];
            PopUpController.instance.instantiateMessagePopUp("Matchmaking Status", "Waiting for opponent.<br>Game Id: " + responseJSON["game"], "Cancel", 
            () => ServerController.leave(credentials["nick"], credentials["password"], responseJSON["game"]));
            ServerController.update(credentials["nick"], responseJSON["game"], this.multiplayerCallback.bind(this));
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