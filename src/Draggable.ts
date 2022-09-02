export class Draggable {
  element: HTMLElement;
  pos1: number;
  pos2: number;
  pos3: number;
  pos4: number;

  constructor(selector: string) {
    this.element = document.querySelector(selector)! as HTMLElement;
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
    this.element.style.top = (this.element.offsetTop - this.pos2) + "px";
    this.element.style.left = (this.element.offsetLeft - this.pos1) + "px";
  }

  closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;
  }

  dragElement = () => {
    if (!this.element) return;
    (this.element.firstElementChild as HTMLElement).onmousedown = this.dragMouseDown;
  }

}
