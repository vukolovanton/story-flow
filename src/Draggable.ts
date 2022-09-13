import connector from "./Connector";
import { saveCurrentState } from "./main";
import { changeLineStyle, drawLine } from "./utils";

export class Draggable {
  element: HTMLElement;
  isReadyForConnect: boolean;
  lineIds: string[];
  pos1: number;
  pos2: number;
  pos3: number;
  pos4: number;

  constructor(element: HTMLElement) {
    this.element = element;
    this.isReadyForConnect = false;
    this.lineIds = [];
    this.pos1 = 0;
    this.pos2 = 0;
    this.pos3 = 0;
    this.pos4 = 0;
  }

  dragElement = () => {
    if (this.element) {
      // this.element.firstElementChild!.onmousedown = this.dragMouseDown;
      this.element.firstElementChild?.addEventListener('dragstart', (e) => {
        this.dragMouseDown(e);
      })
      this.element.addEventListener('contextmenu', this.handleRightClick);
    }
  };

  dragMouseDown = (e: MouseEvent) => {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    this.pos3 = e.clientX;
    this.pos4 = e.clientY;
    document.onmouseup = this.redrawLines;
    document.onmousemove = this.elementDrag;
    changeLineStyle('0.2', '0.5em');
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
      if ((node as HTMLElement)?.dataset?.from === this.element.id || (node as HTMLElement)?.dataset?.to === this.element.id) {
        nodesToDelete.push(node);
      }
    });

    nodesToDelete.forEach(node => node.remove());
  }

  redrawLines = () => {
    document.onmouseup = null;
    document.onmousemove = null;

    this.deleteLines();
    changeLineStyle('1', 'none');

    Object.keys(connector.getConnectors()).forEach(elementId => {
      if (this.element.id === elementId) { // Redraw lines only for current moved item
        const parent = connector.getConnectors()[elementId].parent;
        if (parent.length > 0) {
          parent.forEach(p => drawLine(this.element, p));
        }
        const childrens = connector.getConnectors()[elementId].childrens;
        if (childrens.length > 0) {
          childrens.forEach(c => drawLine(this.element, c));
        }
      }
    })

    saveCurrentState();
  }

  handleRightClick = (event: MouseEvent) => {
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
          drawLine(readyForConnect, event.currentTarget as HTMLElement);
          readyForConnect.classList.remove('ready-for-connect');
          connector.setReadyForConnect(null);

          connector.setChildren(this.element.id, readyForConnect);
          connector.setParent(readyForConnect.id, this.element);

          saveCurrentState();
        }
      }
    }
  }

}
