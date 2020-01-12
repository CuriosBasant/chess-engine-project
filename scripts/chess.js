export default class Chess {
  constructor() {
    this.sound = {
      player: new Audio(),
      movement: './sound/movement.wav',
      check: './sound/check.wav',
      castle: './sound/castle.wav',
      capture: './sound/capture.wav'
    }
    // this.soundToPlay = ''
  }

  set soundToPlay (sound) {
    this.sound.player.src = this.sound[sound]
  }
}