let instance: Connector;
let readyForConnect: HTMLElement | null;

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

  setReadyForConnect(element: HTMLElement | null) {
    if (!readyForConnect) {
      readyForConnect = element;
    } else {
      readyForConnect = null;
    }
  }

  getReadyForConnect(): HTMLElement | null {
    return readyForConnect;
  }

}

const connector = Object.freeze(new Connector());
export default connector;
