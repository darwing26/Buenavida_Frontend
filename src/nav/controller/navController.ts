import NavModel from "../model/navModel.js";
import NavView from "../view/navView.js";


export default class NavController {

    private model : NavModel;
    private view : NavView;

    constructor(model: NavModel, view: NavView) {
        this.model = model;
        this.view = view;
    }

    public async init(): Promise<void> {
        await this.model.init()
        this.view.init()
        this.view.render();
    }



}