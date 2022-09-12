export function getConvertedElementCoordinates(item: HTMLElement): { x: number, y: number } {
  if (item.style) {
    const x = Number(item.style.left.slice(0, -2));
    const y = Number(item.style.top.slice(0, -2));

    return { x, y };
  }

  return { x: 0, y: 0 };
};

export function createDraggableHTMLElement(
  title: string,
  text: string,
  color: string,
  coordinates: { x: number, y: number } | null,
  id: string | null): HTMLElement {
  const newGraph = document.createElement("div");

  newGraph.classList.add('draggable')
  newGraph.setAttribute('id', id);

  if (coordinates && coordinates.x && coordinates.y) {
    newGraph.style.top = `${coordinates.y}px`;
    newGraph.style.left = `${coordinates.x}px`;
  } else {
    newGraph.style.top = `${window.scrollY + 50}px`;
    newGraph.style.left = `${window.scrollX + 25}px`;
  }

  newGraph.innerHTML = `
      <strong draggable="true" style="background-color:${color}">${title}</strong> 
      <div class="content" contenteditable="true">
        <p>${text || 'Quid quid latine dictum sit, altum viditur'}</p>
      </div>
    `;

  document.getElementById('app')?.append(newGraph);
  return newGraph;
};

export function getOffset(element: HTMLElement): { x: number, y: number } {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.x + window.scrollX,
    y: rect.y + window.scrollY,
  }
}

export function drawLine(from: HTMLElement, to: HTMLElement) {
  const svgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const line = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );


  const elementCoordinates = getOffset(from);
  const childCoordinates = getOffset(to);

  svgGroup.setAttribute('data-from', from.id);
  svgGroup.setAttribute('data-to', to.id);

  line.setAttribute('d', `M ${childCoordinates.x} ${childCoordinates.y} L ${elementCoordinates.x} ${elementCoordinates.y}`);
  line.setAttribute('stroke', 'rgb(66, 89, 177)');

  svgGroup.appendChild(line);

  document.getElementById('svg')?.append(svgGroup);

}
