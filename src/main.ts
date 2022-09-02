import { Draggable } from "./Draggable";

window.addEventListener('load', function() {
  const draggableItems = document.querySelectorAll<HTMLElement>('.draggable');
  draggableItems.forEach(item => {
    const draggable = new Draggable(item);
    draggable.dragElement();
  });
});

export { };
