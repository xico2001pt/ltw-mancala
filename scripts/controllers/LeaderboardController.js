import LeaderboardViewer from "../viewers/LeaderboardViewer.js";
import ServerController from "./ServerController.js";

export default class LeaderboardController {
    #viewer;
    #globalRankings;
    #localRankings;

    constructor() {
        this.#viewer = new LeaderboardViewer();
        this.#localRankings = [];
        this.#viewer.initializeButton(this.#updateLeaderboards.bind(this));
        this.#updateLeaderboards();
    }

    addGame(nick, victory) {
        let ranking = this.#getRanking(nick);
        if (ranking == null) {
            ranking = {"nick":nick,"victories":0,"games":0};
            this.#localRankings.push(ranking);
        }
        ranking.games++;
        if (victory) ranking.victories++;
    }

    #updateLeaderboards() {
        ServerController.ranking(this.#updateGlobalRankingsCallback.bind(this));
        this.#viewer.displayLocalLeaderboard(this.#localRankings);
    }

    #getRanking(player) {
        for (var i = 0; i < this.#localRankings.length; ++i) {
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
}