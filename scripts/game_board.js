import Piece, { Empty, Pawn, Knight, Bishop, Rook, Queen, King } from './chess_pieces.js'

class Board {
  constructor(position) {
    this.turn = 0
    this.totalMoves = 0
    this.position = position
    this.initialPosition = position
    this.piece = [[], [], [], [], [], [], [], []]
    this.squareNodes = []
    this.history = []
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
    Piece.nodes = this.squareNodes
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

  nextTurn (sign = 1, NUM_OF_PLAYERS = 2) {
    // console.log(this.turn)
    this.turn = (this.turn + sign + NUM_OF_PLAYERS) % NUM_OF_PLAYERS
    this.totalMoves += sign
  }
}

export default Board
// export { board }