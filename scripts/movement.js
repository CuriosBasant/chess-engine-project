// import { Empty } from './chess_pieces.js'

export default class Move {
  static homes = null
  static hasNavigated = false
  constructor(index) {
    this.from = index
    this.to = null

  }

  static showHomes (bool = true) {
    for (const [className, nodes] of Object.entries(Move.homes)) {
      for (const node of nodes) {
        node.parentNode.classList.toggle(className, bool)
      }
    }
  }

  highlight (flag = true) {
    this.from.node.parentElement.classList.toggle('highlight', flag)
    this.to.node.parentElement.classList.toggle('highlight', flag)
  }
}