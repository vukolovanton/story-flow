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

  renderLinkIcon = () => {
    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const iconLine = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );

    const elementCoordinates = this.element.getBoundingClientRect();
    const childCoordinates = this.childrens[0].getBoundingClientRect();

    iconLine.setAttribute('d', `M ${elementCoordinates.x} ${elementCoordinates.y} L ${childCoordinates.x} ${childCoordinates.y}`);
    iconLine.setAttribute('stroke', 'black');

    iconSvg.appendChild(iconLine);

    document.getElementById('svg')?.append(iconSvg);

  }

  handleDBClick = () => {
    const readyForConnect = connector.getReadyForConnect();

    if (!readyForConnect) {
      connector.setReadyForConnect(this.element);
      return;
    }

    if (readyForConnect) {
      if (readyForConnect.id === this.element.id) {
        connector.setReadyForConnect(null);
        return;
      }

      this.childrens.push(readyForConnect);
      connector.setReadyForConnect(null);
    }

    if (this.childrens.length > 0) {
      this.childrens.forEach(child => {
        child.classList.add('children');
      });
      this.element.classList.add('children')
      this.renderLinkIcon();
    }

  }


  dragElement = () => {
    if (this.element) {
      this.element.firstElementChild!.onmousedown = this.dragMouseDown;
      this.element.addEventListener('dblclick', this.handleDBClick);
    }
  };

}
