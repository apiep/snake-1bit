// Ukuran logis game (piksel). Canvas di-zoom kelipatan bulat di main.ts.
export const CELL = 8
export const COLS = 22
export const ROWS = 22
export const FIELD_X = 8
export const FIELD_Y = 24
export const WIDTH = 192
export const HEIGHT = 208

// 1-bit: hanya dua warna.
export const BLACK = 0x000000
export const WHITE = 0xffffff

export const START_LENGTH = 3
export const START_INTERVAL = 150 // ms per langkah
export const MIN_INTERVAL = 60
export const SPEEDUP = 3 // ms lebih cepat per makanan

export interface Cell {
  x: number
  y: number
}

export type Dir = Readonly<Cell>

export const UP: Dir = { x: 0, y: -1 }
export const DOWN: Dir = { x: 0, y: 1 }
export const LEFT: Dir = { x: -1, y: 0 }
export const RIGHT: Dir = { x: 1, y: 0 }

export const Events = {
  Started: 'snake:started',
  Ate: 'snake:ate',
  Died: 'snake:died'
} as const
