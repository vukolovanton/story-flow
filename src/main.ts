import { Draggable } from "./Draggable";

window.addEventListener('load', function() {
  function collectGraphs() {
    const draggableItems = document.querySelectorAll<HTMLElement>('.draggable');

    draggableItems.forEach(element => {
      const draggable = new Draggable(element);
      draggable.dragElement();
    });
  }

  function createNewGraph() {
    const input = document.querySelector<HTMLInputElement>('.new-card-input');
    if (input) {
      const text = input.value;
      if (!text) return;

      const newGraph = document.createElement("div");

      newGraph.classList.add('draggable')
      newGraph.setAttribute('id', Date.now().toString());

      newGraph.style.top = `${window.scrollY + 50}px`;
      newGraph.style.left = `${window.scrollX + 25}px`;

      newGraph.innerHTML = `
        <strong draggable="true">${text}</strong> 
        <div class="content" contenteditable="true">
          <p>Quid quid latine dictum sit, altum viditur</p>
        </div>
      `;

      document.getElementById('app')?.append(newGraph);
      input.value = '';

      new Draggable(newGraph).dragElement();
    }
  }

  document.querySelector<HTMLButtonElement>('.new-card-add')!.addEventListener('click', createNewGraph);

  collectGraphs();
});


export { };
