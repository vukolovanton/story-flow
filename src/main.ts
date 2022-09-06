import { Draggable } from "./Draggable";
import Graph from './Graphs';

window.addEventListener('load', function() {
  function collectGraphs() {
    const draggableItems = document.querySelectorAll<HTMLElement>('.draggable')
    Graph.addGraphs(Array.from(draggableItems));
  }

  function createDragElements() {
    Graph.getGraphs().forEach(element => {
      const draggable = new Draggable(element);
      draggable.dragElement();
    });
  }

  function createNewGraph() {
    const input = document.querySelector<HTMLInputElement>('.new-card-input');
    if (input) {
      const text = input.value;
      const newDocument = document.createElement("div");

      newDocument.classList.add('draggable')
      newDocument.innerHTML = `
        <header>${text}</header> 
        <div class="content" contenteditable="true">
          <p>Lorem ipsum dolor sit amet, officia excepte</p>
        </div>
      `

      document.getElementById('app')?.append(newDocument);
      input.value = '';
      collectGraphs();
      createDragElements();
    }
  }

  const addButton = document.querySelector<HTMLButtonElement>('.new-card-add');
  addButton?.addEventListener('click', createNewGraph);

  collectGraphs();
  createDragElements();

});

export { };
