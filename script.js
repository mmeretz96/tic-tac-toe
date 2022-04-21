const Player = (number, name) =>{
  return {number, name}
}

const gameBoard = (()=>{
  let board = ["","","","","","","","",""]

  const getBoard = () => {
    return board
  }

  const placeMarker = (cellNumber, player) => {
    if(board[cellNumber] != "") return false
    board[cellNumber] = player
    return true
  }

  const reset = () => {
    board = ["","","","","","","","",""]
  }

  const isFull = () => {
    if (!board.includes("")) return true
    return false
  }

  return {isFull, getBoard, placeMarker, reset}
})()

const displayController = (()=>{
  const cells = document.querySelectorAll(".cell")
  const instructions = document.querySelector(".instruction-text")
  const resetBtn = document.querySelector(".reset")
  const board = document.querySelector(".board")
  const form = document.querySelector(".start-form")
  const addCellListeners = () => {
    cells.forEach(cell => {
      cell.addEventListener("click", e => gameController.handleCellClick(e.target))
    })
  }

  const addButtonListeners = () => {
    resetBtn.addEventListener("click", gameController.startGame)
  }
  const fillCell = (cellNumber, player) => {
    cells.forEach(cell =>{
      if(cell.getAttribute("data") == cellNumber){
        cell.classList.add(`player${player.number}-bg`)
      }
    })
    
  }

  const highlightCombination = (combination) =>{
    console.log(combination)
    combination.forEach(number => {
      cells[number].classList.add("winning-cell")
    })
  }

  const renderInstruction = (text) =>{
    instructions.innerText = text
  }
  const renderBoard = () =>{
    form.style.display = "none"
    board.style.display = "grid"
    resetBtn.style.display = "inline"
  }
  const reset = () =>{
    cells.forEach(cell => {
      cell.classList.remove("player1-bg")
      cell.classList.remove("player2-bg")
      cell.classList.remove("winning-cell")
    })
  }
  return {renderBoard,addButtonListeners, addCellListeners, reset, fillCell, renderInstruction, highlightCombination}
})()



const gameController = (() => {
  let players = []
  let cellsActive = true
  let aiGame = false
  const init = (player1Name, player2Name) => {
    
    players.push(Player(1,player1Name))
    if (!player2Name) {
      aiGame = true
      players.push(Player(2,"AI"))
    }
    if (player2Name) players.push(Player(2,player2Name))
    displayController.addCellListeners()
    displayController.addButtonListeners()
    startGame()
  }

  const startGame = () => {
    displayController.renderBoard()
    displayController.reset()
    gameBoard.reset()
    cellsActive = true
    displayController.renderInstruction(`${players[0].name}'s turn`)
  }

  const switchPlayer = () => {
    players.push(players.shift())
  }

  // return null if game isnt over
  const getWinCombination = (board = gameBoard.getBoard()) => {
    let winCombinations = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,4,8],[2,4,6],[0,3,6],
      [1,4,7],[2,5,8]]
    let winCombination = null

    winCombinations.forEach(row => {
      if(board[row[0]] && board[row[0]] == board[row[1]] && board[row[0]] == board[row[2]]){
        winCombination = row
      }
    })
    if(gameBoard.isFull()) return "tie"
    return winCombination
  }

  const handleCellClick = (cell) => {
    if (!cellsActive) return 
    playerTurn(players[0],cell.getAttribute("data"))
    let winCombination
    if(winCombination = getWinCombination()){
      endGame(winCombination)
      return
    }
    switchPlayer()
    displayController.renderInstruction(`${players[0].name}'s turn`)
    if(aiGame){
      makeAiMove()
    }
    
  }

  const playerTurn = (player, cellNumber) => {
    if(!gameBoard.placeMarker(cellNumber, player)) return 
    displayController.fillCell(cellNumber, player)
  }

  const makeAiMove = () => {
      let cellNumber = ai.getMove()
      gameBoard.placeMarker(cellNumber, players[0])
      displayController.fillCell(cellNumber, players[0])
      if(winCombination = getWinCombination()){
        endGame(winCombination)
        return
      }
      switchPlayer()
      displayController.renderInstruction(`${players[0].name}'s turn`)
  }
  const endGame = (winCombo) =>{
    if (winCombo == "tie")return displayController.renderInstruction(`It's a tie!`)
    displayController.renderInstruction(`${players[0].name} has won`)
    displayController.highlightCombination(winCombo)
    cellsActive = false
    if(players[0].name=="AI") switchPlayer()
    
  }

  return {init, handleCellClick, startGame}
})()


const ai = (()=>{
  const getMove = () =>{
    let board = gameBoard.getBoard()
    let cellNumber
    let freeCells = []
    board.forEach((cell,i) =>{
      if(cell == ""){
        freeCells.push(i)
      }
    })
    return freeCells[Math.floor(Math.random()*freeCells.length)]
  }
  return {getMove}
})()


const startBtn = document.querySelector(".start")

startBtn.addEventListener("click", e => {
  e.preventDefault()
  let player1Name = document.getElementById("player1-name").value
  let player2Name = document.getElementById("player2-name").value
  if(!player1Name) player1Name = "Player 1"
  gameController.init(player1Name, player2Name)
})


