import PopUpController from "./controllers/PopUpController.js"
import MenuController from "./controllers/MenuController.js";
import AuthenticationController from "./controllers/AuthenticationController.js";
import GameBuilder from "./controllers/GameBuilder.js";
import GameController from "./controllers/GameController.js";

function main() {
    new PopUpController();  // Instantiate Singleton

    let menuController = new MenuController(0);
    let authenticationController = new AuthenticationController();
    let gameController = new GameController();
    let gameBuilder = new GameBuilder(gameController);
}

main();