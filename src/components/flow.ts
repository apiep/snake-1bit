import { Component, type Entity } from 'phatty'
import { COLS, Events, ROWS, START_LENGTH } from '../config'
import { FoodComponent, FoodRendererComponent } from './food'
import { GridPositionComponent, SnakeBodyComponent } from './grid'
import { InputComponent } from './input'
import {
  SnakeControllerComponent, SnakeMovementComponent, SnakeRendererComponent
} from './snake'
import { GameStateComponent } from './state'

const RESTART_LOCK_MS = 500 // cegah restart tidak sengaja tepat setelah mati

// Mesin alur permainan: title -> playing -> dead -> playing ...
// Ular dan makanan adalah entity yang dibuat ulang setiap ronde.
export class GameFlowComponent extends Component {
  priority = -20
  required = [GameStateComponent, InputComponent]
  private state!: GameStateComponent
  private input!: InputComponent
  private snake?: Entity
  private food?: Entity

  create (): void {
    this.state = this.entity.components.get(GameStateComponent)
    this.input = this.entity.components.get(InputComponent)
  }

  update (time: number): void {
    if (!this.input.takeConfirm()) return
    if (this.state.phase === 'playing') return
    if (this.state.phase === 'dead' && time - this.state.deadAt < RESTART_LOCK_MS) return
    this.start()
  }

  private start (): void {
    this.snake?.destroy()
    this.food?.destroy()
    this.state.reset()
    this.input.reset()

    const snake = this.entities.create()
    snake.components.add(SnakeBodyComponent, { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }, START_LENGTH)
    snake.components.add(SnakeControllerComponent)
    snake.components.add(SnakeMovementComponent)
    snake.components.add(SnakeRendererComponent)
    this.snake = snake

    const food = this.entities.create()
    food.components.add(GridPositionComponent)
    food.components.add(FoodComponent)
    food.components.add(FoodRendererComponent)
    this.food = food

    this.scene.events.emit(Events.Started)
  }
}
