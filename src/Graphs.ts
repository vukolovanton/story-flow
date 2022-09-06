let graphs: NodeList;
let instance: Graphs;

class Graphs {
  constructor() {
    if (instance) {
      throw new Error("Singleton already exists");
    }
    instance = this;
  }

  getInstance() {
    return this;
  }

  addGraphs(element: any) {
    graphs = element;
  }

  getGraphs() {
    return graphs;
  }
}

const singletonGraph = Object.freeze(new Graphs());
export default singletonGraph;
