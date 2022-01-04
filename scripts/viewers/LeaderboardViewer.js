export default class LeaderboardViewer {
    #globalLeaderboard;
    #localLeaderboard;
    #updateButton;

    constructor() {
        this.#initializeElements();
    }

    initializeButton(callback) {
        this.#updateButton.addEventListener("click", callback);
    }

    displayGlobalLeaderboard(rankings) {
        LeaderboardViewer.#displayLeaderboard(rankings, this.#globalLeaderboard);
    }

    displayLocalLeaderboard(rankings) {
        LeaderboardViewer.#displayLeaderboard(rankings, this.#localLeaderboard);
    }

    #initializeElements() {
        this.#globalLeaderboard = document.getElementById("global-leaderboard");
        this.#localLeaderboard = document.getElementById("local-leaderboard");
        this.#updateButton = document.getElementById("update-leaderboard-button");
    }

    static #displayLeaderboard(rankings, leaderboard) {
        leaderboard.innerHTML = LeaderboardViewer.#getHeader();
        for (let player of rankings) {
            leaderboard.innerHTML += LeaderboardViewer.#parseRanking(player);
        }
    }

    static #parseRanking(ranking) {
        return `<tr><td>${ranking.nick}</td><td>${ranking.victories}</td><td>${ranking.games}</td></tr>`
    }

    static #getHeader() {
        return "<tr><th>Username</th><th>Victories</th><th>Games</th></tr>";
    }
}