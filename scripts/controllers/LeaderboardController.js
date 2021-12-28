import LeaderboardViewer from "../viewers/LeaderboardViewer";

export default class LeaderboardController {
    #viewer;
    #rankings;

    constructor() {
        this.#viewer = new LeaderboardViewer();
        this.#rankings = [];
    }

    addVictory(nick) {
        if (this.#getRanking(nick) == null) {
            this.#rankings.push({"nick":nick,"victories":1,"losses":0});
        }
        else {
            this.#getRanking(nick).victories++;
        }
    }

    addLoss(nick) {
        if (this.#getRanking(nick) == null) {
            this.#rankings.push({"nick":nick,"victories":0,"losses":1});
        }
        else {
            this.#getRanking(nick).losses++;
        }
    }

    #getRanking(player) {
        for (var i = 0; i < this.#rankings.length; ++i) {
            if (this.#rankings[i].nick == player) {
                return this.#rankings[i];
            }
        }
        return null;
    }
}