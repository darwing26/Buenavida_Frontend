import NavController from "../../nav/controller/navController.js";
import NavFactory from "../../nav/nav.js";
import ProductsController from "../../products/controller/productsController.js";
import ProductsFactory from "../../products/products.js";
import IndexModel from "../model/indexModel.js";
import IndexView from "../view/indexView.js";

export default class IndexCotroller {

    private readonly productsController : ProductsController;
    private readonly navController : NavController;

    constructor(
        private readonly indexModel : IndexModel, 
        private readonly indexView : IndexView
    ) {
        
        this.navController = NavFactory.create();
        this.productsController = ProductsFactory.create();
    }

    public async init() {
        this.indexModel.init()
        this.indexView.init()
        
        await this.navController.init()
        console.log("init nav controller");

        await this.productsController.init()
        console.log("init products controller");


    }

    

   

    



}