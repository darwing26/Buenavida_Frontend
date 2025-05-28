import ProductsModel from "../model/productsModel.js";
import ProductsView from "../view/productsView.js";

export default class ProductsController {

    private model : ProductsModel;
    private view : ProductsView;

    constructor(model: ProductsModel, view: ProductsView) {
        this.model = model;
        this.view = view;
    }

    public async init(): Promise<void> {
        await this.model.init()
        this.view.init()
        this.view.render();
    }



}