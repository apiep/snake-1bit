import * as Phaser from 'phaser'
import { Component } from 'phatty'
import { CELL, COLS, Events, FIELD_X, FIELD_Y, ROWS, type Cell } from '../config'
import { palette } from '../palette'
import { drawBitmap } from '../pixelFont'
import { GridPositionComponent, SnakeBodyComponent } from './grid'
import { stateOf } from './state'

const OUTLINE = [
  '...##...',
  '..#..#..',
  '.#....#.',
  '#......#',
  '#......#',
  '.#....#.',
  '..#..#..',
  '...##...'
]

const FILLED = [
  '...##...',
  '..####..',
  '.######.',
  '########',
  '########',
  '.######.',
  '..####..',
  '...##...'
]

// Penanda "ini makanan". Memindahkan diri ke sel kosong saat pertama dibuat
// dan setiap kali ular makan.
export class FoodComponent extends Component {
  required = [GridPositionComponent]
  private pos?: GridPositionComponent

  constructor () {
    super()
    this.scene.events.on(Events.Ate, this.respawn, this)
  }

  create (): void {
    this.pos = this.entity.components.get(GridPositionComponent)
    this.respawn()
  }

  destroy (): void {
    this.scene.events.off(Events.Ate, this.respawn, this)
  }

  private respawn (): void {
    if (!this.pos) return
    const body = this.entities.query.with(SnakeBodyComponent).first()?.components.get(SnakeBodyComponent)
    const free: Cell[] = []
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (!body?.occupies(x, y)) free.push({ x, y })
      }
    }
    if (free.length === 0) {
      stateOf(this).die(true) // papan penuh = menang
      return
    }
    const cell = Phaser.Math.RND.pick(free)
    this.pos.x = cell.x
    this.pos.y = cell.y
  }
}

export class FoodRendererComponent extends Component {
  priority = 10
  required = [GridPositionComponent]
  private g: Phaser.GameObjects.Graphics
  private pos!: GridPositionComponent

  constructor () {
    super()
    this.g = this.scene.add.graphics().setDepth(1)
  }

  create (): void {
    this.pos = this.entity.components.get(GridPositionComponent)
  }

  update (time: number): void {
    const bitmap = Math.floor(time / 300) % 2 === 0 ? OUTLINE : FILLED
    this.g.clear()
    drawBitmap(this.g, bitmap, FIELD_X + this.pos.x * CELL, FIELD_Y + this.pos.y * CELL, palette.fg)
  }

  destroy (): void {
    this.g.destroy()
  }
}
