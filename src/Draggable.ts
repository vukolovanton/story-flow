import connector from "./Connector";

export class Draggable {
  element: HTMLElement;
  isReadyForConnect: boolean;
  childrens: Array<HTMLElement>;
  lineIds: string[];
  pos1: number;
  pos2: number;
  pos3: number;
  pos4: number;

  constructor(element: HTMLElement) {
    this.element = element;
    this.isReadyForConnect = false;
    this.childrens = [];
    this.lineIds = [];
    this.pos1 = 0;
    this.pos2 = 0;
    this.pos3 = 0;
    this.pos4 = 0;
  }

  dragElement = () => {
    if (this.element) {
      // this.element.firstElementChild!.onmousedown = this.dragMouseDown;
      this.element.firstElementChild.addEventListener('dragstart', (e) => {
        this.dragMouseDown(e);
      })
      this.element.addEventListener('contextmenu', this.handleDBClick);
    }
  };

  dragMouseDown = (e: MouseEvent) => {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    this.pos3 = e.clientX;
    this.pos4 = e.clientY;
    document.onmouseup = this.closeDragElement;
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

  deleteLines() {
    const mainSvg = document.getElementById('svg');
    const groups = mainSvg?.childNodes;
    const nodesToDelete: ChildNode[] = [];

    groups?.forEach(node => {
      if (node?.dataset?.from === this.element.id || node?.dataset?.to === this.element.id) {
        nodesToDelete.push(node);
      }
    });

    nodesToDelete.forEach(node => node.remove());
  }

  closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;

    this.deleteLines();

    Object.keys(connector.getConnectors()).forEach(elementId => {
      if (this.element.id === elementId) { // Redraw lines only for current moved item
        const parent = connector.getConnectors()[elementId].parent;
        if (parent.length > 0) {
          parent.forEach(p => this.drawLine(p, this.element));
        }
        const childrens = connector.getConnectors()[elementId].childrens;
        if (childrens.length > 0) {
          childrens.forEach(c => this.drawLine(c, this.element));
        }
      }
    })
  }

  drawLine = (from: HTMLElement, to: HTMLElement) => {
    const svgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const line = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );

    const elementCoordinates = from.getBoundingClientRect();
    const childCoordinates = to.getBoundingClientRect();

    svgGroup.setAttribute('data-from', from.id);
    svgGroup.setAttribute('data-to', to.id);

    line.setAttribute('d', `M ${elementCoordinates.x} ${elementCoordinates.y} L ${childCoordinates.x} ${childCoordinates.y}`);
    line.setAttribute('stroke', 'black');

    svgGroup.appendChild(line);

    document.getElementById('svg')?.append(svgGroup);

  }

  handleDBClick = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const readyForConnect = connector.getReadyForConnect()?.element;
    if (!readyForConnect) {
      connector.setReadyForConnect(this);
      this.element.classList.add('ready-for-connect');
    } else {
      if (readyForConnect.id === this.element.id) {
        connector.setReadyForConnect(null);
        this.element.classList.remove('ready-for-connect');
      } else { // readyForConnect - родитель, который был выбран сначала, this - на чем случился клик затем
        if (event.currentTarget) {
          this.drawLine(readyForConnect, event.currentTarget as HTMLElement);
          readyForConnect.classList.remove('ready-for-connect');
          connector.setReadyForConnect(null);

          // connector.setChildren(readyForConnect.id, this.element);
          // connector.setParent(this.element.id, readyForConnect);
          connector.setChildren(this.element.id, readyForConnect);
          connector.setParent(readyForConnect.id, this.element);
        }
      }
    }
  }

}
