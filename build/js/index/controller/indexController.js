import NavFactory from "../../nav/nav.js";
import ProductsFactory from "../../products/products.js";
export default class IndexCotroller {
    indexModel;
    indexView;
    productsController;
    navController;
    constructor(indexModel, indexView) {
        this.indexModel = indexModel;
        this.indexView = indexView;
        this.navController = NavFactory.create();
        this.productsController = ProductsFactory.create();
    }
    async init() {
        this.indexModel.init();
        this.indexView.init();
        await this.navController.init();
        console.log("init nav controller");
        await this.productsController.init();
        console.log("init products controller");
    }
}
