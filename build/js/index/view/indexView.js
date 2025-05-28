export default class IndexView {
    elements;
    constructor() {
        this.elements = {
            main: document.querySelector("main") ?? document.createElement("main"),
            path: document.querySelector("meta[name=path]") ??
                document.createElement("meta"),
        };
    }
    getPageFromMeta = () => {
        const pathElement = this.elements["path"];
        return pathElement ? pathElement.getAttribute("page") ?? "error" : "error";
    };
    renderMain = (componentName) => {
        if (this.elements["main"] !== undefined) {
            this.elements["main"].innerHTML = "";
            const a = document.createElement(componentName);
            a.className = "dinamic-content";
            this.elements["main"].appendChild(a);
        }
    };
    init() {
        console.log("init view");
    }
}
