export default class BoardConfiguration {
    constructor(holesPerSide, seedsPerHole, firstPlayer) {
        this.holesPerSide = parseInt(holesPerSide);
        this.seedsPerHole = parseInt(seedsPerHole);
        this.firstPlayer =  firstPlayer;
    }
}