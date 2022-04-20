const gameBoard = (()=>{
  let board = ["","","","","","","","",""]

  const getBoard = () => {
    return board
  }

  const placeMarker = (cellNumber, player) => {
    if(board[cellNumber] != "") return false
    board[cellNumber] = player.symbol
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

  const renderBoard = () => {
    cells.forEach(cell => {
      cell.innerText = gameBoard.getBoard()[cell.getAttribute("data")]
    });
  }

  const fillCell = (cell, symbol) => {
    cell.innerText = symbol
  }
  const highlightCombination = (combination) =>{
    console.log(combination)
    combination.forEach(number => {
      cells[number].style.color = "red"
    })
  }

  const renderInstruction = (text) =>{
    instructions.innerText = text
  }

  const reset = () =>{
    cells.forEach(cell => {
      cell.style.color = "black"
    })
  }
  return {reset, renderBoard, fillCell, renderInstruction, highlightCombination}
})()

const Player = (symbol) =>{
  return {symbol}
}

const gameController = (() => {
  let players = [Player("X"), Player("O")]

  const init = () => {
    addCellListeners()
    addButtonListeners()
    startGame()
  }

  const startGame = () => {
    displayController.reset()
    gameBoard.reset()
    displayController.renderBoard()
    displayController.renderInstruction(`${players[0].symbol}'s turn`)
  }

  const addButtonListeners = () => {
    document.querySelector(".reset").addEventListener("click", startGame)
  }

  const addCellListeners = () => {
    document.querySelectorAll(".cell").forEach(cell => {
      cell.addEventListener("click", e => handleCellClick(e.target))
    })
  }

  const switchPlayer = () => {
    players.push(players.shift())
  }

  const isGameOver = () => {
    const board = gameBoard.getBoard()
    let winCombinations = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,4,8],[2,4,6],[0,3,6],
      [1,4,7],[2,5,8]
    ]
    let winCombination = null
    winCombinations.forEach(row => {
      if(board[row[0]] && board[row[0]] == board[row[1]] && board[row[0]] == board[row[2]]){
        gameOver = true
        winCombination = row
      }
    })
    if(gameBoard.isFull()){
      return "tie"
    }
    
    return winCombination
  }

  const handleCellClick = (cell) => {
    if(gameBoard.placeMarker(cell.getAttribute("data"), players[0])){
      displayController.fillCell(cell,players[0].symbol)
      let winCombo = isGameOver()
      if(winCombo){
        endGame(winCombo)
        return
      }
      switchPlayer()
      displayController.renderInstruction(`${players[0].symbol}'s turn`)
    }
  }

  const endGame = (winCombo) =>{
    if (winCombo == "tie"){
      displayController.renderInstruction(`It's a tie!`)
      return
    }
    displayController.renderInstruction(`${players[0].symbol} has won`)
    displayController.highlightCombination(winCombo)
  }
  return {init}
})()

gameController.init()
