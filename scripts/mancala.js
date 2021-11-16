import MenuController from "./controllers/MenuController.js";
import AuthenticationController from "./controllers/AuthenticationController.js";
import GameBuilder from "./controllers/GameBuilder.js";

function main() {
    let menuController = new MenuController();
    let authenticationController = new AuthenticationController();
    let gameBuilder = new GameBuilder(menuController, authenticationController);
}

main();