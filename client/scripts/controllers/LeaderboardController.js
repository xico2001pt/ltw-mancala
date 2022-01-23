import LeaderboardViewer from "../viewers/LeaderboardViewer.js";
import ServerController from "./ServerController.js";

export default class LeaderboardController {
    static #storageName = "leaderboard";
    #viewer;
    #globalRankings;
    #localRankings;

    constructor() {
        this.#viewer = new LeaderboardViewer();
        this.#globalRankings = [];
        this.#localRankings = this.#loadLocalLeaderboard();
        this.#viewer.initializeButton(this.#updateLeaderboards.bind(this));
        this.#updateLeaderboards();
        this.#viewer.displayGlobalLeaderboard(this.#globalRankings);
    }

    addGame(nick, victory) {
        let ranking = this.#getRanking(nick);
        if (ranking == null) {
            ranking = {"nick":nick,"victories":0,"games":0};
            this.#localRankings.push(ranking);
        }
        ranking.games++;
        if (victory) ranking.victories++;
        this.#saveLocalLeaderboard();
    }

    #updateLeaderboards() {
        ServerController.ranking(this.#updateGlobalRankingsCallback.bind(this));
        this.#viewer.displayLocalLeaderboard(this.#localRankings);
    }

    #getRanking(player) {
        for (let i = 0; i < this.#localRankings.length; ++i) {
            if (this.#localRankings[i].nick == player) {
                return this.#localRankings[i];
            }
        }
        return null;
    }

    async #updateGlobalRankingsCallback(response) {
        let responseJSON = await response.json();
        if (response.status == 200) {
            this.#globalRankings = responseJSON["ranking"];
        } else {
            this.#globalRankings = [];
        }
        this.#viewer.displayGlobalLeaderboard(this.#globalRankings);
    }

    #loadLocalLeaderboard() {
        let result = undefined;
        if (typeof(Storage) !== "undefined") {
            result = localStorage.getItem(LeaderboardController.#storageName);
        }
        return result ? JSON.parse(result) : [];
    }

    #saveLocalLeaderboard() {
        let result = undefined;
        if (typeof(Storage) !== "undefined") {
            result = localStorage.setItem(LeaderboardController.#storageName, JSON.stringify(this.#localRankings));
        }
    }
}