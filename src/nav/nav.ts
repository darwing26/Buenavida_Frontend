import NavController from "./controller/navController.js";
import NavModel from "./model/navModel.js";
import NavView from "./view/navView.js";


export default class NavFactory {

    public static create() : NavController {
        const model = new NavModel();
        const view = new NavView(model);
        const controller = new NavController(model, view);
        return controller;

    }

}