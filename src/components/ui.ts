import type * as Phaser from 'phaser'
import { Component } from 'phatty'
import { CELL, COLS, FIELD_X, FIELD_Y, ROWS, WIDTH } from '../config'
import { palette } from '../palette'
import { drawText, strokeBox } from '../pixelFont'
import { GameStateComponent } from './state'

const pad = (n: number): string => String(n).padStart(3, '0')

// Bingkai arena + titik di tengah tiap sel.
export class FieldRendererComponent extends Component {
  priority = 10
  private g: Phaser.GameObjects.Graphics

  constructor () {
    super()
    this.g = this.scene.add.graphics().setDepth(0)
  }

  update (): void {
    const g = this.g
    g.clear()
    strokeBox(g, FIELD_X - 3, FIELD_Y - 3, COLS * CELL + 6, ROWS * CELL + 6, palette.fg)
    g.fillStyle(palette.fg, 1)
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        g.fillRect(FIELD_X + x * CELL + 3, FIELD_Y + y * CELL + 3, 1, 1)
      }
    }
  }

  destroy (): void {
    this.g.destroy()
  }
}

export class HudRendererComponent extends Component {
  priority = 10
  required = [GameStateComponent]
  private g: Phaser.GameObjects.Graphics
  private state!: GameStateComponent

  constructor () {
    super()
    this.g = this.scene.add.graphics().setDepth(3)
  }

  create (): void {
    this.state = this.entity.components.get(GameStateComponent)
  }

  update (): void {
    this.g.clear()
    drawText(this.g, `SCORE ${pad(this.state.score)}`, FIELD_X, 6, 2, palette.fg)
    drawText(this.g, `BEST ${pad(this.state.best)}`, WIDTH - FIELD_X, 6, 2, palette.fg, 'right')
  }

  destroy (): void {
    this.g.destroy()
  }
}

// Layar judul dan game over, digambar di atas arena.
export class OverlayRendererComponent extends Component {
  priority = 20
  required = [GameStateComponent]
  private g: Phaser.GameObjects.Graphics
  private state!: GameStateComponent

  constructor () {
    super()
    this.g = this.scene.add.graphics().setDepth(10)
  }

  create (): void {
    this.state = this.entity.components.get(GameStateComponent)
  }

  update (time: number): void {
    const g = this.g
    g.clear()
    if (this.state.phase === 'playing') return

    const cx = WIDTH / 2
    const cy = FIELD_Y + (ROWS * CELL) / 2
    const w = 136
    const h = 76
    const x = cx - w / 2
    const y = cy - h / 2
    const blink = Math.floor(time / 500) % 2 === 0

    g.fillStyle(palette.bg, 1)
    g.fillRect(x, y, w, h)
    strokeBox(g, x, y, w, h, palette.fg)
    strokeBox(g, x + 3, y + 3, w - 6, h - 6, palette.fg)

    if (this.state.phase === 'title') {
      drawText(g, 'SNAKE', cx, y + 10, 5, palette.fg, 'center')
      if (blink) drawText(g, 'PRESS SPACE', cx, y + 46, 2, palette.fg, 'center')
      drawText(g, 'ARROWS WASD SWIPE', cx, y + 61, 1, palette.fg, 'center')
      return
    }

    drawText(g, this.state.won ? 'YOU WIN!' : 'GAME OVER', cx, y + 10, 3, palette.fg, 'center')
    drawText(g, `SCORE ${pad(this.state.score)}`, cx, y + 31, 2, palette.fg, 'center')
    drawText(g, this.state.newBest ? 'NEW BEST!' : `BEST ${pad(this.state.best)}`, cx, y + 46, 1, palette.fg, 'center')
    if (blink) drawText(g, 'PRESS SPACE', cx, y + 56, 2, palette.fg, 'center')
  }

  destroy (): void {
    this.g.destroy()
  }
}
