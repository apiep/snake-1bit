import * as Phaser from 'phaser'
import { Component } from 'phatty'
import { DOWN, LEFT, RIGHT, UP, type Dir } from '../config'

const KEYMAP: Record<string, Dir> = {
  ArrowUp: UP,
  KeyW: UP,
  ArrowDown: DOWN,
  KeyS: DOWN,
  ArrowLeft: LEFT,
  KeyA: LEFT,
  ArrowRight: RIGHT,
  KeyD: RIGHT
}

const SWIPE_DISTANCE = 8 // piksel logis
const MAX_QUEUE = 3

// Keyboard + swipe/tap -> antrian arah dan sinyal "konfirmasi" (start/retry).
// Komponen lain hanya membaca lewat take*(), tidak menyentuh Phaser input.
export class InputComponent extends Component {
  priority = -100

  private queue: Dir[] = []
  private confirm = false
  private origin: { x: number, y: number } | null = null
  private swiped = false

  constructor () {
    super()
    const { input } = this.scene
    input.keyboard!.addCapture('UP,DOWN,LEFT,RIGHT,SPACE')
    input.keyboard!.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, this.onKey, this)
    input.on(Phaser.Input.Events.POINTER_DOWN, this.onDown, this)
    input.on(Phaser.Input.Events.POINTER_MOVE, this.onMove, this)
    input.on(Phaser.Input.Events.POINTER_UP, this.onUp, this)
  }

  takeDirection (): Dir | undefined {
    return this.queue.shift()
  }

  takeConfirm (): boolean {
    const c = this.confirm
    this.confirm = false
    return c
  }

  reset (): void {
    this.queue.length = 0
    this.confirm = false
  }

  destroy (): void {
    const { input } = this.scene
    input.keyboard?.off(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, this.onKey, this)
    input.off(Phaser.Input.Events.POINTER_DOWN, this.onDown, this)
    input.off(Phaser.Input.Events.POINTER_MOVE, this.onMove, this)
    input.off(Phaser.Input.Events.POINTER_UP, this.onUp, this)
  }

  private push (d: Dir): void {
    if (this.queue.length >= MAX_QUEUE) return
    const last = this.queue[this.queue.length - 1]
    if (last === d) return
    this.queue.push(d)
  }

  // Phaser bisa meng-emit ulang event yang sama kalau beberapa tombol masuk
  // dalam satu frame (antrian diproses per-keydown dan per-frame).
  private seen = new WeakSet<KeyboardEvent>()

  private onKey (e: KeyboardEvent): void {
    if (e.repeat || this.seen.has(e)) return
    this.seen.add(e)
    const dir = KEYMAP[e.code]
    if (dir) this.push(dir)
    else if (e.code === 'Space' || e.code === 'Enter') this.confirm = true
  }

  private onDown (p: Phaser.Input.Pointer): void {
    this.origin = { x: p.x, y: p.y }
    this.swiped = false
  }

  private onMove (p: Phaser.Input.Pointer): void {
    if (!this.origin || !p.isDown) return
    const dx = p.x - this.origin.x
    const dy = p.y - this.origin.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_DISTANCE) return
    this.push(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? RIGHT : LEFT) : (dy > 0 ? DOWN : UP))
    this.origin = { x: p.x, y: p.y }
    this.swiped = true
  }

  private onUp (): void {
    if (this.origin && !this.swiped) this.confirm = true
    this.origin = null
  }
}
