import PopUpViewer from "../viewers/PopUpViewer.js";
import PopUp from "../models/PopUp.js";

export default class PopUpController {
    static instance = undefined;

    #viewer;

    constructor() {
        if (PopUpController.instance) throw new Error("Singleton classes can't be instantiated more than once.");
        
        PopUpController.instance = this;
        this.#viewer = new PopUpViewer();
    }

    instantiateMessagePopUp(title, message, buttonText, callback) {
        this.#viewer.instantiatePopUp(new PopUp(title, message, buttonText, callback));
        this.#viewer.open();
    }
}