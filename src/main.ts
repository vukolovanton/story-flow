import connector from "./Connector";
import { Draggable } from "./Draggable";
import { State, StateItem } from "./interfaces";
import { clearObject, createDraggableHTMLElement, drawLine, getConvertedElementCoordinates } from "./utils";

let state: State = {};

function activateGraphs() {
  const draggableItems = document.querySelectorAll<HTMLElement>('.draggable');

  draggableItems.forEach(element => {
    const draggable = new Draggable(element);
    draggable.dragElement();
  });
}

function createNewGraph() {
  const input = document.querySelector<HTMLInputElement>('.new-card-text');
  if (input) {
    const text = input.value;
    if (!text) {
      return
    }

    let color = document.querySelector<HTMLInputElement>('.new-card-color')?.value;
    if (!color) {
      color = '#2196F3';
    }

    const newGraph = createDraggableHTMLElement(
      text,
      'Quid quid latine dictum sit, altum viditur',
      color,
      null,
      Date.now().toString()
    );
    new Draggable(newGraph).dragElement();
    input.value = '';
  }
}

export function saveCurrentState() {
  const items = document.querySelectorAll<HTMLElement>('.draggable'); // Save information about Graphs
  items.forEach(item => {
    if (!item.id) return;

    const id = item.id;
    const strong = item.getElementsByTagName('strong')[0];
    const color = strong.style.backgroundColor;
    const title = strong.innerText;
    const text = item.getElementsByTagName('p')[0].innerText;

    state[id] = {
      id,
      title,
      text,
      color,
      position: getConvertedElementCoordinates(item),
      connections: [],
    }
  });

  const lines = document.querySelectorAll<SVGElement>('g'); // Save information about lines between Graphs
  lines.forEach(line => {
    const from = Number(line.dataset?.from);
    const to = Number(line.dataset?.to);

    if (from && state[from]) {
      state[from].connections.push({ from, to });
    }
  });

  localStorage.setItem('state', JSON.stringify(state));
}

export function deleteItemFromState(id: string) {
  delete state[id];
}

function loadState(rawState: string) {
  if (rawState) {
    const savedState: State = JSON.parse(rawState);

    const itemsToConnect: StateItem[] = [];

    Object.keys(savedState).forEach(id => {
      const item = savedState[id];

      createDraggableHTMLElement(
        item.title,
        item.text,
        item.color,
        { x: item.position.x, y: item.position.y },
        id
      );

      if (item.connections.length > 0) {
        itemsToConnect.push(item); // We need to create elements first and connect them after
      }
    });

    itemsToConnect.forEach(item => {
      if (item.connections.length > 0) {
        const itemHTMLElement = document.getElementById(item.id);
        if (itemHTMLElement) {
          item.connections.forEach(connection => {
            const toHTMLElement = document.getElementById(connection.to.toString());
            if (toHTMLElement) {
              const line = drawLine(itemHTMLElement, toHTMLElement);
              connector.setChildren(itemHTMLElement.id, toHTMLElement);
              connector.setParent(toHTMLElement.id, itemHTMLElement);
              line.setAttribute('data-from', connection.from.toString());
              line.setAttribute('data-to', connection.to.toString());
            }
          })
        }
      }
    });

  }
}

function saveJsonObjToFile() {
  // file setting
  const text = JSON.stringify(state);
  const name = "sample.json";
  const type = "text/plain";

  // create file
  const a = document.createElement("a");
  const file = new Blob([text], { type: type });
  a.href = URL.createObjectURL(file);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function deleteExistingGraphs() {
  const graphs = document.querySelectorAll<HTMLElement>('.draggable');
  const lines = document.querySelectorAll<SVGElement>('g');

  graphs.forEach(graph => graph.remove());
  lines.forEach(line => line.remove());

  clearObject(state);
}

function uploadFile(event: Event) {
  if (event && event.target) {
    const file = (event.target as HTMLInputElement).files;
    if (file && file[0]) {
      let reader = new FileReader();
      reader.readAsText(file[0]);

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          deleteExistingGraphs();
          loadState(reader.result as string);
          activateGraphs();
        }
      };

      reader.onerror = () => {
        alert(reader.error);
      };
    }
  }

}

window.addEventListener('load', function() {

  document.querySelector<HTMLButtonElement>('.new-card-add')!.addEventListener('click', createNewGraph);
  document.querySelector<HTMLButtonElement>('.save')!.addEventListener('click', saveJsonObjToFile);
  document.getElementById('file')?.addEventListener('change', uploadFile);

  const localState = localStorage.getItem('state');
  if (localState) {
    loadState(localState);
  }
  activateGraphs();
});


export { };
