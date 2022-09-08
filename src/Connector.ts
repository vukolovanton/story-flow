import { Draggable } from "./Draggable";


interface Connectors {
  [key: string]: {
    parent: HTMLElement[],
    childrens: HTMLElement[],
  }
}

let instance: Connector;
let readyForConnect: Draggable | null;
let connectos: Connectors = {};

class Connector {
  constructor() {
    if (instance) {
      throw new Error("Singleton already exists");
    }
    instance = this;
  }

  getInstance() {
    return this;
  }

  setReadyForConnect(element: Draggable | null) {
    if (!readyForConnect) {
      readyForConnect = element;
    } else {
      readyForConnect = null;
    }
  }

  getReadyForConnect(): Draggable | null {
    return readyForConnect;
  }

  setChildren(id: string, element: HTMLElement) {
    if (!connectos[id]) {
      connectos[id] = {
        parent: [],
        childrens: [],
      }
    }
    connectos[id].childrens.push(element);
  }

  setParent(id: string, element: HTMLElement) {
        if (!connectos[id]) {
      connectos[id] = {
        parent: [],
        childrens: [],
      }
    }
    connectos[id].parent.push(element);
  }

  getConnectors(): Connectors {
    return connectos;
  }

}

const connector = Object.freeze(new Connector());
export default connector;
