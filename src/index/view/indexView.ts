export default class IndexView {
  private readonly elements: { [name: string]: HTMLElement };

  constructor() {
    this.elements = {
      main: document.querySelector("main") ?? document.createElement("main"),
      path:
        document.querySelector("meta[name=path]") ??
        document.createElement("meta"),
    };
  }

  public getPageFromMeta = (): string => {
    const pathElement = this.elements["path"];
    return pathElement ? pathElement.getAttribute("page") ?? "error" : "error";
  };

  public renderMain = (componentName: string): void => {
    if (this.elements["main"] !== undefined) {
      this.elements["main"].innerHTML = "";
      const a = document.createElement(componentName);
      a.className = "dinamic-content";
      this.elements["main"].appendChild(a);
    }
  };

  public init() {
    console.log("init view");
  }

  
}
