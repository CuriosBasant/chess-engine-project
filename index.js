import Chess from './scripts/chess.js'
import Board from './scripts/game_board.js'
// import Movement from './scripts/piece_movement.js'
import Move from './scripts/movement.js'
import { Empty } from './scripts/chess_pieces.js'

const chess = new Chess()

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
    navigateTo(+btn.value)
  })
})

const history = document.getElementById('board-history')

function squareOnClick (ev) {
  let index = board.squareNodes.indexOf(this)
  index = [(index / 8) | 0, index % 8]

  if (Move.hasNavigated) {
    board.history.splice(board.totalMoves)
    const node = history.children[board.totalMoves]
    while (node != history.lastElementChild) {
      history.lastElementChild.remove()
    }
    Move.hasNavigated = false
  }

  // Piece that has been clicked
  const piece = board.piece[index[0]][index[1]]
  if (board.history[board.totalMoves] == undefined) {
    if (piece.side == board.turn) {
      board.history[board.totalMoves] = new Move(piece)
      Move.homes = piece.calculateValidMoves(board.turn, board.piece)
      Move.showHomes()
      this.classList.add('highlight')
    } else {
      console.info("Can't select that!")
    }
  } else {
    Move.showHomes(false)
    const move = board.history[board.totalMoves]
    if (piece.side == board.turn) {
      move.from.node.parentElement.classList.remove('highlight')
      board.history[board.totalMoves] = undefined
      if (move.from == piece) {
        console.info('Unselected!')
      } else {
        piece.node.click()
      }
    } else {
      move.to = piece
      this.classList.add('highlight')
      startMovingPiece(move)
      updateHistory(piece.indices, move.from.symbol)
    }
  }
}

// console.log(history)

function navigateTo (sign) {
  const isTakingBack = sign == -1

  const moveCount = board.totalMoves - isTakingBack

  if (moveCount < 0 || moveCount > board.history.length - 1) {
    console.warn('Moves out of Bound!')
    return
  }
  Move.hasNavigated = true

  if (moveCount > isTakingBack - 1) {
    board.history[moveCount - isTakingBack].highlight()
  }
  // board.totalMoves - isTakingBack * 2 > -1
  startMovingPiece(board.history[moveCount], isTakingBack)

  history.children[board.totalMoves].classList.add('highlight')
  history.children[board.totalMoves - sign].classList.remove('highlight')
}

function startMovingPiece (move, toTakeBack = null) {
  const [r1, c1] = move.from.indices, [r2, c2] = move.to.indices
  // const nF = move.from.node, nT = move.to.node

  const [x, y] = [c2 - c1, r2 - r1].map(n => n * 62.5)

  if (board.totalMoves > 0) {
    board.history[board.totalMoves - 1].highlight(false)
  }

  if (toTakeBack == null) {

    if (move.to.name == null) {
      chess.soundToPlay = 'movement'
    } else {
      chess.soundToPlay = 'capture'
    }
  }

  move.from.node.style.transform = `translate(${x}px, ${y}px)`
  move.from.node.addEventListener(
    'webkitTransitionEnd',
    ev => {
      ev.target.style.transform = 'none'

      const tempToParent = move.to.node.parentElement
      move.from.node.parentElement.appendChild(move.to.node)
      tempToParent.appendChild(move.from.node)

      board.piece[r1][c1] = (toTakeBack ? move.to.putPiece() : new Empty([r1, c1]))
      board.piece[r2][c2] = move.from

      chess.sound.player.play()
    },
    { once: true }
  )
  board.nextTurn(1 - toTakeBack * 2)
}

function updateHistory ([r2, c2], symbol) {
  // console.log(history)
  const hist = history.firstElementChild.cloneNode()
  history.lastElementChild.classList.remove('highlight')
  hist.classList.add('highlight')
  hist.textContent =
    (board.totalMoves % 2 ? `${board.totalMoves / 2 + 0.5}. ` : '') +
    symbol +
    String.fromCharCode(c2 + 97) +
    Math.abs(r2 - 8)
  history.appendChild(hist)
}

function exchangeElements (element1, element2) {
  var clonedElement1 = element1.cloneNode(true)
  var clonedElement2 = element2.cloneNode(true)


  element2.parentNode.replaceChild(clonedElement1, element2)
  element1.parentNode.replaceChild(clonedElement2, element1)

  return clonedElement1
}

function moveByNotation (notation) {
  const pieceToSearch = notation[0], square = notation.slice(-2)
  const moveToIndex = [+square[1], square[0].charCodeAt() - 97]

}

function clone (obj) {
  return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj))
}

/*













Pratik bhai, maine aapse ek video mei sawal kiya tha ki - kya nrc se agar ek ek hindu or muslim bahar hote hai to kya cab ke tahat wo hindu wapas andar ho jayega? To fir uss muslim ka kya hoga. Or isske jawab mei aapne mujhe CAB samjha diya tha (uska shukriya), lekin mera sawal kuch or tha.
Iske alawa mere kuch or bhi sawal hai, kripya isse dhyan se padhe or sahi jaankari dein:
1. Jab bharat ka batwara hua, to Pakistan, Afghanistan or Bangladesh mei bhi to kuch Muslims rahe honge jo batwara nahi chahte the or bharat mei hi rehna chahte the. Lekin gareebi or asahaye hone ke karan yaha nahi aa paaye, to un muslims ko CAB mei add kyu nhi kiya gaya. Kyunki aap kehe rahe hai ki in desho mei agar muslims par zurm hota hai to ye unka personal matter hai.
2. Assam ki jansankhya lagbhag 4 crore hai, or waha jab NRC laagu hua to kareeb 14 crore rupees karch hue, to agar pure desh mei NRC laagu hota hai to Demonetization ke waqt jese pura desh lines mei khada hoga or sabka samay or paisa barbaad hoga. Kyunki, assam jese pura desh yaha waha apne documents ikkathhe karne mei laga hoga, mental health par asar padega so alag.
3. Assam mei bhale hi NRC successful na raha ho, lekin iss baat ki gurantee kon lega ki pure desh mei NRC apply hoga to successful hi hoga. Kya aap??


*/
