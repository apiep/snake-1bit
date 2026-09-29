import * as Phaser from 'phaser'
import { BLACK, HEIGHT, WIDTH } from './config'
import { GameScene } from './scenes/GameScene'

// Zoom kelipatan bulat supaya tiap piksel logis = N x N piksel layar (tajam).
// Tinggi footer credit dikurangi dari ruang yang tersedia.
const fitZoom = (): number => {
  const credit = document.getElementById('credit')?.offsetHeight ?? 0
  return Math.max(1, Math.floor(Math.min(window.innerWidth / WIDTH, (window.innerHeight - credit) / HEIGHT)))
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: BLACK,
  pixelArt: true,
  scale: { mode: Phaser.Scale.NONE, zoom: fitZoom() },
  scene: [GameScene]
})

window.addEventListener('resize', () => game.scale.setZoom(fitZoom()))

if (import.meta.env.DEV) (window as unknown as { __game: Phaser.Game }).__game = game
