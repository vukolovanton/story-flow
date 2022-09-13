import { Draggable } from "./Draggable";


interface Connectors {
  [key: string]: {
    parent: HTMLElement[],
    childrens: HTMLElement[],
  }
}

let instance: Connector;
let readyForConnect: Draggable | null;
let connectors: Connectors = {};

class Connector {
  constructor() {
    if (instance) {
      throw new Error("Singleton already exists");
    }
    instance = this;
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
    if (!connectors[id]) {
      connectors[id] = {
        parent: [],
        childrens: [],
      }
    }
    connectors[id].childrens.push(element);
  }

  setParent(id: string, element: HTMLElement) {
        if (!connectors[id]) {
      connectors[id] = {
        parent: [],
        childrens: [],
      }
    }
    connectors[id].parent.push(element);
  }

  getConnectors(): Connectors {
    return connectors;
  }

  deleteConnectors(elementId: string) {
    delete connectors[elementId];

    Object.keys(connectors).forEach(id => {
      const item = connectors[id];

      if (item.parent.length > 0) {
        item.parent.forEach((parent, index) => {
          if (parent.id === elementId) {
            item.parent.splice(index, 1);
          }
        });
      }

      if (item.childrens.length > 0) {
        item.childrens.forEach((children, index) => {
          if (children.id === elementId) {
            item.childrens.splice(index, 1);
          }
        });
      }
    });

  }

}

const connector = Object.freeze(new Connector());
export default connector;
