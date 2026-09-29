import { BLACK, WHITE } from './config'

// Satu-satunya "state warna" game. Semua renderer membaca fg/bg dari sini,
// jadi efek invert (flash saat mati) cukup membalik dua nilai ini.
export const palette = {
  fg: WHITE as number,
  bg: BLACK as number,
  set (inverted: boolean) {
    this.fg = inverted ? BLACK : WHITE
    this.bg = inverted ? WHITE : BLACK
  }
}
