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
      const newGraph = document.createElement("div");

      newGraph.classList.add('draggable')
      newGraph.innerHTML = `
        <header draggable="true" id=${Date.now().toString()}>${text}</header> 
        <div class="content" contenteditable="true">
          <p>Lorem ipsum dolor sit amet, officia excepte</p>
        </div>
      `;

      document.getElementById('app')?.append(newGraph);
      input.value = '';

      new Draggable(newGraph).dragElement();
    }
  }

  document.querySelector<HTMLButtonElement>('.new-card-add')!.addEventListener('click', createNewGraph);

  collectGraphs();

  // const canvas = document.querySelector('canvas')!;
  // const ctx = canvas?.getContext('2d');

  // function animate() {
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   requestAnimationFrame(animate);
  // }

  // animate();

});


export { };
