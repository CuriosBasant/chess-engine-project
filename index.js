// import Chess from './scripts/chess.js'
import Board from './scripts/chess_board.js'

const board = new Board([
  ['R2', 'N2', 'B2', 'Q2', 'K2', 'B2', 'N2', 'R2'],
  ['P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2'],
  ['_', '_', '_', '_', '_', '_', '_', '_'],
  ['_', '_', '_', '_', '_', '_', '_', '_'],
  ['_', '_', '_', '_', '_', '_', '_', '_'],
  ['_', '_', '_', '_', '_', '_', '_', '_'],
  ['P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1'],
  ['R1', 'N1', 'B1', 'Q1', 'K1', 'B1', 'N1', 'R1']
])

board.create(squareOnClick)

console.log(board)

Array.from(document.querySelectorAll('#buttons button')).forEach(btn => {
  btn.addEventListener('click', () => {
    board.navigateTo(+btn.value)
  })
})

const history = document.getElementById('board-history')

function squareOnClick (ev) {
  let index = board.squareNodes.indexOf(this)
  index = [(index / 8) | 0, index % 8]

  selectPiece(board.getPieceAtIndex(index))
}

let selectedPiece = null, homes = null

function selectPiece (piece) {
  if (selectedPiece == null) {
    if (piece.side == board.turn) {
      selectedPiece = piece
      homes = piece.calculateValidMoves()
      showHomes()
    } else {
      piece.invalid()
    }
  } else {
    showHomes(false)

    if (piece.side == board.turn) {
      if (selectedPiece != piece) {
        selectedPiece = null
        selectPiece(piece)
      }
    } else {
      selectedPiece.moveTo(piece)
      selectedPiece = null
    }
  }
}

function showHomes (bool = true) {
  selectedPiece.node.parentElement.classList.toggle('highlight', bool)
  for (const [className, nodes] of Object.entries(homes)) {
    for (const node of nodes) {
      node.parentElement.classList.toggle(className, bool)
    }
  }
}