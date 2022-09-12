import { Draggable } from "./Draggable";
import { createDraggableHTMLElement, drawLine, getConvertedElementCoordinates } from "./utils";

interface StateItem {
  id: string;
  title: string;
  text: string;
  position: {
    x: number;
    y: number;
  },
  to: number[];
}

interface State {
  [key: string]: StateItem;
}

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

    const newGraph = createDraggableHTMLElement(text, 'Quid quid latine dictum sit, altum viditur', color, null, Date.now().toString());
    new Draggable(newGraph).dragElement();
    input.value = '';
  }
}

function saveCurrentState(event: Event) {
  event.preventDefault();
  state = {};

  const items = document.querySelectorAll<HTMLElement>('.draggable'); // Save information about Graphs
  items.forEach(item => {
    if (!item.id) return;

    const id = item.id;
    const title = item.getElementsByTagName('strong')[0].innerText;
    const text = item.getElementsByTagName('p')[0].innerText;

    state[id] = {
      id,
      title,
      text,
      position: getConvertedElementCoordinates(item),
      to: [],
    }
  });

  const lines = document.querySelectorAll<SVGElement>('g'); // Save information about lines between Graphs
  lines.forEach(line => {
    const from = Number(line.dataset?.from);
    const to = Number(line.dataset?.to);

    if (from && state[from]) {
      state[from].to.push(to);
    }
  });

  localStorage.setItem('state', JSON.stringify(state));
}

function loadState() {
  const rawSavedState = localStorage.getItem('state');
  if (rawSavedState) {
    const savedState: State = JSON.parse(rawSavedState);

    const itemsToConnect: StateItem[] = [];

    Object.keys(savedState).forEach(id => {
      const item = savedState[id];
      createDraggableHTMLElement(item.title, item.text, 'red', { x: item.position.x, y: item.position.y }, id);

      if (item.to.length > 0) {
        itemsToConnect.push(item); // We need to create elements first and connect them after
      }
    });

    itemsToConnect.forEach(item => {
      if (item.to.length > 0) {
        const itemHTMLElement = document.getElementById(item.id);
        if (itemHTMLElement) {
          item.to.forEach(to => {
            const toHTMLElement = document.getElementById(to.toString());
            if (toHTMLElement) {
              drawLine(itemHTMLElement, toHTMLElement);
            }
          })
        }
      }
    });

  }
}

window.addEventListener('load', function() {

  document.querySelector<HTMLButtonElement>('.new-card-add')!.addEventListener('click', createNewGraph);
  document.querySelector<HTMLButtonElement>('.save')!.addEventListener('click', saveCurrentState);

  loadState();
  activateGraphs();
});


export { };
