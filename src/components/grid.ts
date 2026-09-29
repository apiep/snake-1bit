import { Component } from 'phatty'
import type { Cell } from '../config'

// Posisi di grid (satuan sel, bukan piksel).
export class GridPositionComponent extends Component {
  constructor (public x = 0, public y = 0) {
    super()
  }
}

// Badan ular. cells[0] = kepala.
export class SnakeBodyComponent extends Component {
  cells: Cell[]
  growth = 0

  constructor (head: Cell, length: number) {
    super()
    this.cells = Array.from({ length }, (_, i) => ({ x: head.x - i, y: head.y }))
  }

  get head (): Cell {
    return this.cells[0]
  }

  occupies (x: number, y: number): boolean {
    return this.cells.some((c) => c.x === x && c.y === y)
  }
}
