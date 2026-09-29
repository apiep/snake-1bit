# Snake 1-bit

Game snake 1-bit (hanya hitam & putih) untuk browser, dibuat dengan [Phaser 3](https://phaser.io) dan
[phatty](https://github.com/grischaerbe/phatty) (entity component system untuk Phaser).

Live: https://snake-1bit.handlify.qiscus.io/

## Main

- Panah / WASD untuk belok, Spasi atau Enter untuk mulai dan ulang.
- Layar sentuh: geser untuk belok, ketuk untuk mulai.
- Makan untuk menambah skor; ular makin cepat. Menabrak dinding atau badan sendiri = game over.
- Skor terbaik disimpan di `localStorage`.

## Jalankan

```sh
bun install
bun run dev        # http://localhost:5173
bun run build      # typecheck + build ke dist/
bun run start      # build + serve di port 3000 (dipakai untuk deploy)
```

## Struktur

Satu entity `game` memegang state, input, alur, dan renderer HUD. Ular dan makanan dibuat ulang
sebagai entity baru tiap ronde. Semua komponen ada di `src/components/`.

`GameScene` sengaja tidak memanggil `super.create()`: di phatty 0.0.15 itu mengganti `this.entities`
dengan instance baru yang belum ter-setup sehingga tidak ada komponen yang di-update.

---

Made with Sonnet 5.5
