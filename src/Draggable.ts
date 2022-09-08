import connector from "./Connector";

export class Draggable {
  element: HTMLElement;
  isReadyForConnect: boolean;
  childrens: Array<HTMLElement>;
  pos1: number;
  pos2: number;
  pos3: number;
  pos4: number;

  constructor(element: HTMLElement) {
    this.element = element;
    this.isReadyForConnect = false;
    this.childrens = [];
    this.pos1 = 0;
    this.pos2 = 0;
    this.pos3 = 0;
    this.pos4 = 0;
  }

  dragMouseDown = (e: MouseEvent) => {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    this.pos3 = e.clientX;
    this.pos4 = e.clientY;
    document.onmouseup = this.closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = this.elementDrag;
  }

  elementDrag = (e: MouseEvent) => {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    this.pos1 = this.pos3 - e.clientX;
    this.pos2 = this.pos4 - e.clientY;
    this.pos3 = e.clientX;
    this.pos4 = e.clientY;
    // set the element's new position:
    (this.element as HTMLElement).style.top = ((this.element as HTMLElement).offsetTop - this.pos2) + "px";
    (this.element as HTMLElement).style.left = ((this.element as HTMLElement).offsetLeft - this.pos1) + "px";
  }

  closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;
  }

  drawLine = (from: HTMLElement, to: HTMLElement) => {
    const svgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const line = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );

    const elementCoordinates = from.getBoundingClientRect();
    const childCoordinates = to.getBoundingClientRect();

    line.setAttribute('d', `M ${elementCoordinates.x} ${elementCoordinates.y} L ${childCoordinates.x} ${childCoordinates.y}`);
    line.setAttribute('stroke', 'black');

    svgGroup.appendChild(line);

    document.getElementById('svg')?.append(svgGroup);

  }

  handleDBClick = (event: MouseEvent) => {
    event.stopPropagation();
    const readyForConnect = connector.getReadyForConnect();
    if (!readyForConnect) {
      connector.setReadyForConnect(this.element);
      this.element.classList.add('ready-for-connect');
    } else {
      if (readyForConnect.id === this.element.id) {
        connector.setReadyForConnect(null);
        this.element.classList.remove('ready-for-connect');
      } else {
        this.drawLine(readyForConnect, event.currentTarget);
        readyForConnect.classList.remove('ready-for-connect');
        connector.setReadyForConnect(null);
      }
    }
  }


  dragElement = () => {
    if (this.element) {
      this.element.firstElementChild!.onmousedown = this.dragMouseDown;
      this.element.addEventListener('dblclick', this.handleDBClick);
    }
  };

}
