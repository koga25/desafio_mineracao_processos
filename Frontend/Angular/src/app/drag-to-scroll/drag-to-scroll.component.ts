import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'drag-to-scroll',
  templateUrl: './drag-to-scroll.component.html',
  styleUrls: ['./drag-to-scroll.component.css']
})
export class DragToScrollComponent {


  mouseDown = false;

  pos: position;


  constructor() {
    this.pos = new position();
  }

  startDragging(e: MouseEvent, ele: HTMLElement) {
    this.mouseDown = true;

    this.pos.x = e.pageX;
    this.pos.left = ele.scrollLeft;

    this.pos.y = e.pageY;
    this.pos.top = ele.scrollTop;
  }

  stopDragging() {
    this.mouseDown = false;
  }

  moveEvent(e: MouseEvent, ele: HTMLElement) {
    e.preventDefault();
    if (!this.mouseDown) return;

    const x: number = e.pageX;
    const scrollX: number = x - this.pos.x;
    ele.scrollLeft = this.pos.left - scrollX;

    const y: number = e.pageY;
    const scrollY: number = y - this.pos.y;
    ele.scrollTop = this.pos.top - scrollY;
  }

}

class position {
  top: number = 0;
  left: number = 0;
  x: number = 0;
  y: number = 0;
}
