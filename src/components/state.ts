import { Component } from 'phatty'
import { Events } from '../config'

export type Phase = 'title' | 'playing' | 'dead'

const STORAGE_KEY = 'snake1bit.best'

const loadBest = (): number => {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || 0
  } catch {
    return 0
  }
}

const saveBest = (n: number): void => {
  try {
    localStorage.setItem(STORAGE_KEY, String(n))
  } catch {
    // storage tidak tersedia (mode privat, dll) — abaikan
  }
}

// State global permainan: fase, skor, skor terbaik.
export class GameStateComponent extends Component {
  phase: Phase = 'title'
  score = 0
  best = loadBest()
  newBest = false
  won = false
  deadAt = 0

  reset (): void {
    this.phase = 'playing'
    this.score = 0
    this.newBest = false
    this.won = false
  }

  addScore (n = 1): void {
    this.score += n
    if (this.score > this.best) {
      this.best = this.score
      this.newBest = true
      saveBest(this.best)
    }
  }

  die (won = false): void {
    if (this.phase !== 'playing') return
    this.phase = 'dead'
    this.won = won
    this.deadAt = this.scene.time.now
    this.scene.events.emit(Events.Died, won)
  }
}

export const stateOf = (c: Component): GameStateComponent =>
  c.entities.query.with(GameStateComponent).first()!.components.get(GameStateComponent)
