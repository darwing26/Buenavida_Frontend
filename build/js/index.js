import IndexCotroller from "./index/controller/indexController.js";
import IndexModel from "./index/model/indexModel.js";
import IndexView from "./index/view/indexView.js";
const indexModel = new IndexModel();
const indexView = new IndexView();
const indexController = new IndexCotroller(indexModel, indexView);
indexController.init();
