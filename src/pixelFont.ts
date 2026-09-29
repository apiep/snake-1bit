import type * as Phaser from 'phaser'

type Graphics = Phaser.GameObjects.Graphics

// Font piksel 3x5. Setiap glyph = 5 baris, dipisah spasi.
const RAW: Record<string, string> = {
  A: '.#. #.# ### #.# #.#',
  B: '##. #.# ##. #.# ##.',
  C: '.## #.. #.. #.. .##',
  D: '##. #.# #.# #.# ##.',
  E: '### #.. ##. #.. ###',
  F: '### #.. ##. #.. #..',
  G: '.## #.. #.# #.# .##',
  H: '#.# #.# ### #.# #.#',
  I: '### .#. .#. .#. ###',
  J: '..# ..# ..# #.# .#.',
  K: '#.# #.# ##. #.# #.#',
  L: '#.. #.. #.. #.. ###',
  M: '#.# ### ### #.# #.#',
  N: '##. #.# #.# #.# #.#',
  O: '.#. #.# #.# #.# .#.',
  P: '##. #.# ##. #.. #..',
  Q: '.#. #.# #.# ##. .##',
  R: '##. #.# ##. #.# #.#',
  S: '.## #.. .#. ..# ##.',
  T: '### .#. .#. .#. .#.',
  U: '#.# #.# #.# #.# ###',
  V: '#.# #.# #.# #.# .#.',
  W: '#.# #.# ### ### #.#',
  X: '#.# #.# .#. #.# #.#',
  Y: '#.# #.# .#. .#. .#.',
  Z: '### ..# .#. #.. ###',
  0: '### #.# #.# #.# ###',
  1: '.#. ##. .#. .#. ###',
  2: '### ..# ### #.. ###',
  3: '### ..# ### ..# ###',
  4: '#.# #.# ### ..# ..#',
  5: '### #.. ### ..# ###',
  6: '### #.. ### #.# ###',
  7: '### ..# .#. .#. .#.',
  8: '### #.# ### #.# ###',
  9: '### #.# ### ..# ###',
  ' ': '... ... ... ... ...',
  '!': '.#. .#. .#. ... .#.',
  '-': '... ... ### ... ...',
  ':': '... .#. ... .#. ...',
  '/': '..# ..# .#. #.. #..'
}

const FONT: Record<string, string[]> = Object.fromEntries(
  Object.entries(RAW).map(([ch, rows]) => [ch, rows.split(' ')])
)

export const textWidth = (text: string, scale: number): number =>
  text.length === 0 ? 0 : text.length * 4 * scale - scale

export function drawText (
  g: Graphics,
  text: string,
  x: number,
  y: number,
  scale: number,
  color: number,
  align: 'left' | 'center' | 'right' = 'left'
): void {
  const w = textWidth(text, scale)
  let cx = align === 'center' ? Math.round(x - w / 2) : align === 'right' ? x - w : x
  g.fillStyle(color, 1)
  for (const ch of text.toUpperCase()) {
    const rows = FONT[ch] ?? FONT[' ']
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 3; c++) {
        if (rows[r][c] === '#') g.fillRect(cx + c * scale, y + r * scale, scale, scale)
      }
    }
    cx += 4 * scale
  }
}

// Bitmap kecil: '#' = piksel menyala.
export function drawBitmap (g: Graphics, rows: readonly string[], x: number, y: number, color: number): void {
  g.fillStyle(color, 1)
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      if (rows[r][c] === '#') g.fillRect(x + c, y + r, 1, 1)
    }
  }
}

// Kotak garis 1px.
export function strokeBox (g: Graphics, x: number, y: number, w: number, h: number, color: number): void {
  g.fillStyle(color, 1)
  g.fillRect(x, y, w, 1)
  g.fillRect(x, y + h - 1, w, 1)
  g.fillRect(x, y, 1, h)
  g.fillRect(x + w - 1, y, 1, h)
}
