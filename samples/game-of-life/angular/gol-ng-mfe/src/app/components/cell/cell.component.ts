import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {
  private isAlive = false;
  constructor() { }

  ngOnInit() {
  }

  nextCellStateIsAlive(): boolean {
    let neighbors = 0;
    if (neighbors < 2) {
      return false; // underpopulation
    }

    if (neighbors > 3) {
      return false; // overpopulation
    }

    if (neighbors === 3 && this.isAlive === false) {
      return true; // reproduction
    }

    if (neighbors === 2 || neighbors === 3 && this.isAlive) {
      return true;
    }

    return false;
  }
}
