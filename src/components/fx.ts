import { Component } from 'phatty'
import { Events } from '../config'
import { palette } from '../palette'

const FLASH_MS = 600
const FLASH_STEP_MS = 100

// Flash invert hitam/putih saat mati. Juga menjaga warna latar kamera
// sinkron dengan palette.
export class FlashComponent extends Component {
  priority = -50
  private startedAt = -1
  private bg = -1

  constructor () {
    super()
    this.scene.events.on(Events.Died, this.onDied, this)
    this.scene.events.on(Events.Started, this.onStarted, this)
  }

  update (): void {
    if (this.startedAt >= 0) {
      const elapsed = this.scene.time.now - this.startedAt
      if (elapsed >= FLASH_MS) {
        this.startedAt = -1
        palette.set(false)
      } else {
        palette.set(Math.floor(elapsed / FLASH_STEP_MS) % 2 === 0)
      }
    }
    if (this.bg !== palette.bg) {
      this.bg = palette.bg
      this.scene.cameras.main.setBackgroundColor(palette.bg)
    }
  }

  destroy (): void {
    this.scene.events.off(Events.Died, this.onDied, this)
    this.scene.events.off(Events.Started, this.onStarted, this)
    palette.set(false)
  }

  private onDied (): void {
    this.startedAt = this.scene.time.now
  }

  private onStarted (): void {
    this.startedAt = -1
    palette.set(false)
  }
}

// Bunyi kotak (square wave) lewat WebAudio — sesuai nuansa 1-bit.
export class SfxComponent extends Component {
  private ctx?: AudioContext

  constructor () {
    super()
    const sound = this.scene.sound
    if ('context' in sound) this.ctx = sound.context
    this.scene.events.on(Events.Started, this.onStarted, this)
    this.scene.events.on(Events.Ate, this.onAte, this)
    this.scene.events.on(Events.Died, this.onDied, this)
  }

  destroy (): void {
    this.scene.events.off(Events.Started, this.onStarted, this)
    this.scene.events.off(Events.Ate, this.onAte, this)
    this.scene.events.off(Events.Died, this.onDied, this)
  }

  private onStarted (): void {
    this.tone(660, 0, 0.06)
  }

  private onAte (): void {
    this.tone(880, 0, 0.05)
    this.tone(1320, 0.05, 0.07)
  }

  private onDied (): void {
    this.tone(220, 0, 0.12)
    this.tone(165, 0.12, 0.12)
    this.tone(110, 0.24, 0.25)
  }

  private tone (freq: number, after: number, duration: number): void {
    const ctx = this.ctx
    if (!ctx) return
    if (ctx.state === 'suspended') void ctx.resume()
    const t = ctx.currentTime + after
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.06, t)
    gain.gain.linearRampToValueAtTime(0, t + duration)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + duration)
  }
}
