import { Scene } from 'phatty'
import { FlashComponent, SfxComponent } from '../components/fx'
import { GameFlowComponent } from '../components/flow'
import { InputComponent } from '../components/input'
import { GameStateComponent } from '../components/state'
import { FieldRendererComponent, HudRendererComponent, OverlayRendererComponent } from '../components/ui'

export class GameScene extends Scene {
  constructor () {
    super({ key: 'GameScene' })
  }

  // Sengaja tidak memanggil super.create(): di phatty 0.0.15 itu mengganti
  // this.entities dengan instance baru yang belum ter-setup (update tak jalan).
  create (): void {
    // Entity "game" dibuat pertama, jadi updatenya jalan lebih dulu
    // daripada ular/makanan (urutan antar-entity = urutan pembuatan).
    const game = this.entities.create()
    game.components.add(GameStateComponent)
    game.components.add(InputComponent)
    game.components.add(FlashComponent)
    game.components.add(SfxComponent)
    game.components.add(GameFlowComponent)
    game.components.add(FieldRendererComponent)
    game.components.add(HudRendererComponent)
    game.components.add(OverlayRendererComponent)
  }
}
