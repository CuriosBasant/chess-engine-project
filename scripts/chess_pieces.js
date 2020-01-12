// import { board } from './game_board.js'
const EMPTY_SQUARE = '_'

class Piece {
  static selected = false
  static path = []
  static toMove = null
  static nodes = null
  constructor(index, name, symbol, player) {
    this.position = index
    this.name = name
    this.symbol = symbol
    this.side = player
    this.node = Piece.nodes[index[0] * 8 + index[1]].firstElementChild
    this.putPiece()

  }

  putPiece () {
    this.node.className = `player-${this.side + 1}`
    this.node.textContent = this.symbol
    return this
  }

  get indices () {
    return JSON.parse(this.node.parentElement.dataset.index)
  }
}

class Empty extends Piece {
  constructor(position, player) {
    super(position, null, '_', -1)
  }
}

class Pawn extends Piece {
  constructor(position, player) {
    super(position, 'Pawn', 'P', player)
    this.canDouble = true
  }

  calculateValidMoves (boardTurn, boardPieces) {
    const path = {
      'home': [],
      'capture': []
    }, dir = boardTurn * 2 - 1

    let index = this.indices.slice()
    const hey = () => {
      index[0] += dir
      const piece = boardPieces[index[0]][index[1]]
      if (piece.name == null) {
        path.home.push(piece.node)
      } else {
        return false
      }
      return true
    }
    if (hey() && this.canDouble) {
      hey()
      index[0] -= dir
    }

    // check captures
    for (const c of [-1, 2]) {
      index[1] += c
      if (index[1] < 0 || index[1] > 7) continue
      const piece = boardPieces[index[0]][index[1]]
      if (!(piece.name == null || piece.side == boardTurn)) {
        path.capture.push(piece.node)
      }
    }

    return path
  }
}

class Knight extends Piece {
  constructor(position, player) {
    super(position, 'Knight', 'N', player)
  }

  calculateValidMoves (boardTurn, boardPieces) {
    const direction = [[-1, -2], [-2, -1], [-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2]]
    const homes = getPieceHomes(this.indices, direction, boardTurn, boardPieces)

    return homes
  }
}

class Bishop extends Piece {
  constructor(position, player) {
    super(position, 'Bishop', 'B', player)
  }

  calculateValidMoves (boardTurn, boardPieces) {
    const direction = [[-1, -1], [-1, 1], [1, 1], [1, -1]]
    const homes = getPieceHomes2D(this.indices, direction, boardTurn, boardPieces)

    return homes
  }
}

class Rook extends Piece {
  constructor(position, player) {
    super(position, 'Rook', 'R', player)
    this.couldCastle = true
  }

  calculateValidMoves (boardTurn, boardPieces) {
    const direction = [[-1, 0], [0, 1], [1, 0], [0, -1]]
    const homes = getPieceHomes2D(this.indices, direction, boardTurn, boardPieces)

    return homes
  }
}

class Queen extends Piece {
  constructor(position, player) {
    super(position, 'Queen', 'Q', player)
  }

  calculateValidMoves (boardTurn, boardPieces) {
    // return Piece._getPath([[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]], this.indices.slice())

    const direction = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]]
    const homes = getPieceHomes2D(this.indices, direction, boardTurn, boardPieces)

    return homes
  }
}

class King extends Piece {
  constructor(position, player) {
    super(position, 'King', 'K', player)
    this.isInCheck = false
    this.canCastle = true
  }

  calculateValidMoves (boardTurn, boardPieces) {
    const direction = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]]
    const homes = getPieceHomes(this.indices, direction, boardTurn, boardPieces)

    return homes
  }
}

export default Piece
export { Empty, Pawn, Knight, Bishop, Rook, Queen, King }

const doesSqrExist = ind => ind.every(n => n > -1 && n < 8)
function getPieceHomes (from, direction, boardTurn, boardPieces) {
  const path = {
    'home': [],
    'capture': []
  }
  for (const dir of direction) {
    let index = from.map((n, i) => n + dir[i])
    if (index.some(n => n < 0 || n > 7)) continue
    const piece = boardPieces[index[0]][index[1]]
    if (piece.name == null) {
      path.home.push(piece.node)
      // index.classList.add('home')
      // Piece.path.push(index)
    } else if (piece.side != boardTurn) {
      // index.classList.add('capture')
      path.capture.push(piece.node)
    }
  }
  return path
}

function getPieceHomes2D (from, direction, boardTurn, boardPieces) {
  const path = {
    'home': [],
    'capture': []
  }
  direction.forEach(dir => {
    let index = from.map((n, i) => n + dir[i])
    while (doesSqrExist(index)) {
      const piece = boardPieces[index[0]][index[1]]
      if (piece.name == null) {
        path.home.push(piece.node)
        // index.classList.add('home')
        // Piece.path.push(index)
      } else {
        if (piece.side != boardTurn) {
          // index.classList.add('capture')
          path.capture.push(piece.node)
        }
        break
      }

      index = index.map((n, i) => n + dir[i])

    }
  })
  return path
}