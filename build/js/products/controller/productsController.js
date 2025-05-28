export default class ProductsController {
    model;
    view;
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }
    async init() {
        await this.model.init();
        this.view.init();
        this.view.render();
    }
}
