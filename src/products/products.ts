import ProductsController from "../products/controller/productsController.js";
import ProductsModel from "../products/model/productsModel.js";
import ProductsView from "../products/view/productsView.js";

export default class ProductsFactory {

    public static create() : ProductsController {
        const model = new ProductsModel();
        const view = new ProductsView(model);
        const controller = new ProductsController(model, view);
        return controller;

    }

}