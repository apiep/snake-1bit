import type * as Phaser from 'phaser'
import { Component } from 'phatty'
import {
  CELL, COLS, Events, FIELD_X, FIELD_Y, MIN_INTERVAL, RIGHT, ROWS, SPEEDUP, START_INTERVAL,
  type Cell, type Dir
} from '../config'
import { palette } from '../palette'
import { FoodComponent } from './food'
import { GridPositionComponent, SnakeBodyComponent } from './grid'
import { InputComponent } from './input'
import { GameStateComponent, stateOf } from './state'

// Menerjemahkan antrian input jadi arah saat ini. Belokan 180 derajat dan
// arah yang sama dibuang; belokan valid lain diambil satu per langkah.
export class SnakeControllerComponent extends Component {
  priority = -10
  dir: Dir = RIGHT
  private input!: InputComponent

  create (): void {
    this.input = this.entities.query.with(InputComponent).first()!.components.get(InputComponent)
  }

  nextDirection (): Dir {
    let d: Dir | undefined
    while ((d = this.input.takeDirection())) {
      const reverse = d.x + this.dir.x === 0 && d.y + this.dir.y === 0
      const same = d.x === this.dir.x && d.y === this.dir.y
      if (reverse || same) continue
      this.dir = d
      break
    }
    return this.dir
  }
}

// Langkah berbasis tick: gerak, tabrakan, makan.
export class SnakeMovementComponent extends Component {
  required = [SnakeBodyComponent, SnakeControllerComponent]
  private body!: SnakeBodyComponent
  private controller!: SnakeControllerComponent
  private state!: GameStateComponent
  private acc = 0

  create (): void {
    this.body = this.entity.components.get(SnakeBodyComponent)
    this.controller = this.entity.components.get(SnakeControllerComponent)
    this.state = stateOf(this)
  }

  update (_time: number, delta: number): void {
    if (this.state.phase !== 'playing') return
    this.acc += Math.min(delta, 100) // tab di-background jangan bikin lompat jauh
    let interval = this.interval()
    while (this.acc >= interval && this.state.phase === 'playing') {
      this.acc -= interval
      this.step()
      interval = this.interval()
    }
  }

  private interval (): number {
    return Math.max(MIN_INTERVAL, START_INTERVAL - this.state.score * SPEEDUP)
  }

  private step (): void {
    const dir = this.controller.nextDirection()
    const { cells } = this.body
    const nx = cells[0].x + dir.x
    const ny = cells[0].y + dir.y

    if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) {
      this.state.die()
      return
    }

    // Ekor akan bergeser kecuali sedang tumbuh, jadi ekor tidak dihitung.
    const growing = this.body.growth > 0
    const solid = growing ? cells.length : cells.length - 1
    for (let i = 0; i < solid; i++) {
      if (cells[i].x === nx && cells[i].y === ny) {
        this.state.die()
        return
      }
    }

    cells.unshift({ x: nx, y: ny })
    if (growing) this.body.growth--
    else cells.pop()

    const food = this.entities.query
      .with([FoodComponent, GridPositionComponent])
      .first()?.components.get(GridPositionComponent)
    if (food && food.x === nx && food.y === ny) {
      this.state.addScore()
      this.body.growth++
      this.scene.events.emit(Events.Ate)
    }
  }
}

export class SnakeRendererComponent extends Component {
  priority = 10
  required = [SnakeBodyComponent, SnakeControllerComponent]
  private g: Phaser.GameObjects.Graphics
  private body!: SnakeBodyComponent
  private controller!: SnakeControllerComponent

  constructor () {
    super()
    this.g = this.scene.add.graphics().setDepth(2)
  }

  create (): void {
    this.body = this.entity.components.get(SnakeBodyComponent)
    this.controller = this.entity.components.get(SnakeControllerComponent)
  }

  update (): void {
    const g = this.g
    const { cells } = this.body
    const px = (c: Cell): number => FIELD_X + c.x * CELL
    const py = (c: Cell): number => FIELD_Y + c.y * CELL

    g.clear()
    g.fillStyle(palette.fg, 1)

    // Badan 6x6 per sel, disambung supaya tampak kontinu.
    for (const c of cells) g.fillRect(px(c) + 1, py(c) + 1, CELL - 2, CELL - 2)
    for (let i = 1; i < cells.length; i++) {
      const a = cells[i - 1]
      const b = cells[i]
      g.fillRect(
        Math.min(px(a), px(b)) + 1,
        Math.min(py(a), py(b)) + 1,
        Math.abs(a.x - b.x) * CELL + CELL - 2,
        Math.abs(a.y - b.y) * CELL + CELL - 2
      )
    }

    // Kepala 8x8 dengan dua mata mengikuti arah.
    const head = cells[0]
    g.fillRect(px(head), py(head), CELL, CELL)
    const d = this.controller.dir
    const eyes = d.x > 0 ? [[4, 1], [4, 5]] : d.x < 0 ? [[2, 1], [2, 5]] : d.y < 0 ? [[1, 2], [5, 2]] : [[1, 4], [5, 4]]
    g.fillStyle(palette.bg, 1)
    for (const [ex, ey] of eyes) g.fillRect(px(head) + ex, py(head) + ey, 2, 2)
  }

  destroy (): void {
    this.g.destroy()
  }
}
