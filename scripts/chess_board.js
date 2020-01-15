import Piece, { Empty, Pawn, Knight, Bishop, Rook, Queen, King } from './chess_pieces.js'
import Chess from './chess.js'

const chess = new Chess()

class Board {
  constructor(position) {
    this.turn = 0
    this.totalMoves = 0
    this.position = position
    this.initialPosition = position
    this.piece = [[], [], [], [], [], [], [], []]
    this.squareNodes = []
    this.history = []
    this.history[-1] = {
      from: { node: document.getElementById('board-history') },
      to: {
        get node () { return this.Parent.from.node.firstElementChild.cloneNode() }
      },
      highlight: () => { },
      init: function () {
        this.to.Parent = this
        delete this.init
        return this
      }
    }.init()

  }

  create (squareOnClick) {
    const brd = document.getElementById('board')
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const sqr = document.createElement('div')
        sqr.dataset.index = `[${i}, ${j}]`
        sqr.classList.add('square', (i + j) % 2 ? 'dark' : 'light')
        sqr.appendChild(document.createElement('span'))

        sqr.addEventListener('click', squareOnClick)
        this.squareNodes.push(sqr)
        brd.appendChild(sqr)
      }
    }
    this.reset()
  }

  reset (position = null) {
    // Piece.nodes = this.squareNodes
    Piece.onBoard = this
    if (position == null) position = this.initialPosition

    const getPieceClass = {
      _: Empty, P: Pawn, N: Knight, B: Bishop, R: Rook, Q: Queen, K: King
    }

    for (let i = 0, s = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++ , s++) {
        const symCode = position[i][j],
          piece = new getPieceClass[symCode[0]]([i, j], symCode[1] - 1)
        this.piece[i][j] = piece//.putPiece([i, j], this.squareNodes[s])
      }
    }
  }

  getPieceAtIndex ([r, c]) {
    return this.piece[r][c]
  }

  navigateTo (sign) {
    const isTakingBack = sign == -1

    const moveCount = this.totalMoves - isTakingBack

    if (moveCount < 0 || moveCount > this.history.length - 1) {
      console.warn('Moves out of Bound!')
      return
    }

    const move = this.history[moveCount]
    const [r1, c1] = move.from.indices, [r2, c2] = move.to.indices
    const [x, y] = [c2 - c1, r2 - r1].map(n => n * 62.5)

    if (isTakingBack) {
      chess.soundToPlay = 'takingBack'
    } else if (move.to.name == null) {
      chess.soundToPlay = 'movement'
    } else {
      chess.soundToPlay = 'capture'
    }

    this.history[this.totalMoves - 1].highlight(false)

    new Promise((resolve, reject) => {
      move.from.node.style.transform = `translate(${x}px, ${y}px)`
      move.from.node.addEventListener('webkitTransitionEnd', resolve, { once: true })
    }).then(() => {
      move.from.node.style.transform = 'none'
      chess.sound.player.play()

      const tempToParent = move.to.node.parentElement
      move.from.node.parentElement.appendChild(move.to.node)
      tempToParent.appendChild(move.from.node)

      this.piece[r1][c1] = (isTakingBack ? move.to.putPiece() : new Empty([r1, c1]))
      this.piece[r2][c2] = move.from

      this.history[moveCount - isTakingBack].highlight()
    })
    this.nextTurn(1 - isTakingBack * 2)
    this.history[-1].from.node.children[this.totalMoves].classList.add('highlight')
    this.history[-1].from.node.children[this.totalMoves - sign].classList.remove('highlight')
  }

  nextTurn (sign = 1, NUM_OF_PLAYERS = 2) {
    // console.log(this.turn)
    this.turn = (this.turn + sign + NUM_OF_PLAYERS) % NUM_OF_PLAYERS
    this.totalMoves += sign
  }

  spliceHistory () {
    if (this.totalMoves < this.history.length) {
      this.history.splice(this.totalMoves)
      const node = this.history[-1].from.node.children[this.totalMoves]

      while (node != this.history[-1].from.node.lastElementChild) {
        this.history[-1].from.node.lastElementChild.remove()
      }
    } else console.log('hahaha lol')
  }
}

export default Board