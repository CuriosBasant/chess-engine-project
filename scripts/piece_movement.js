import { Empty } from './chess_pieces.js'

class Game {
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

const game = new Game()


class Movement {
  constructor() {
   this.from = null
   this.to = null
   this.moveReady = false
   this.homes = null
  }

  selectPiece (index, board) {
   // const index = typeof sq == 'number' ? sq : board.squareNodes.indexOf(sq)
   // temp move.to -> from
   const piece = board.piece[index[0]][index[1]]
   if (this.moveReady) {
    this.showValidHomes(board.squareNodes, false)	// removing homes
    this.moveReady = false
    this.homes = null
    if (piece.side == board.turn) {
      if (this.from == piece) {
       // if (this.from[0] == this.to[0] && this.from[1] == this.to[1]) {
       console.info('You\'ve clicked the same Piece! Lol...')
      } else {
       this.selectPiece(index, board)
      }
      return
    }
    this.to = piece
    this.makeMove(board.squareNodes, board.piece)
    board.history.push([clone(this.from), piece])
    board.nextTurn()
   } else if (piece.side == board.turn) {   // Select if not Ready
    this.from = piece
    // console.log(piece.name);
    this.homes = piece.calculateValidMoves(board.turn, board.piece)

    this.showValidHomes(board.squareNodes)
    this.moveReady = true
   } else {
    console.log('INVALID SQUARE')
   }
  }

  showValidHomes (nodes, bool = true) {
   // console.log('path toggled', this.homes)
   for (const [className, indexes] of Object.entries(this.homes)) {
    for (const [r, c] of indexes) {
      nodes[r * 8 + c].classList.toggle(className, bool)
    }
   }
  }

  makeMove (nodes, boardPieces) {
   let temp = this.from
   const [r1, c1] = this.from.indices, [r2, c2] = this.to.indices
   const node = [this.from.node, this.to.node]
   const [x, y] = [c2 - c1, r2 - r1].map(n => n * 62.5)

   this.from.node.classList.add('making-move')
   this.from.node.firstChild.style.transform = `translate(${x}px, ${y}px)`

   if (this.to.name == null) {
    game.soundToPlay = 'movement'
   } else {
    game.soundToPlay = 'capture'
   }


   this.from.node.firstChild.addEventListener('webkitTransitionEnd', ev => {
    boardPieces[r2][c2] = boardPieces[r1][c1].putPiece([r2, c2], node[1])
    boardPieces[r1][c1] = new Empty([r1, c1]).putPiece([r1, c1], node[0])
    console.info(this.from.name + ' Moved')

    game.sound.player.play()
    ev.target.style.transform = 'none'
    ev.target.classList.remove('making-move')
   }, { once: true })

  }
  navigateTo (sign, history) {

  }
}

function clone (obj) {
  return Object.create(
   Object.getPrototypeOf(obj),
   Object.getOwnPropertyDescriptors(obj)
  )
}

export default Movement