let columns = 16
let rows = 16
let bombTotal = 40
let mode = "intermediate"
let bombArray = []
let modeInfo = {
    beginner: {
        columns: 9,
        rows: 9,
        bombTotal: 10
    },
    intermediate: {
        columns: 16,
        rows: 16,
        bombTotal: 40
    },
    hard: {
        columns: 30,
        rows: 16,
        bombTotal: 99
    },
}

const updateBombTimer = () => {
    let bombString = bombTotal.toString()
    document.getElementById("bomb-1").src = `/minesweeper/${bombString[0]}_seconds.png`
    document.getElementById("bomb-2").src = `/minesweeper/${bombString[1]}_seconds.png`
}

const makeBombs = () => {
    let bombsPlaced = 0
    while (bombsPlaced < bombTotal) {
        const randomRow = Math.floor(Math.random() * rows)
        const randomColumn = Math.floor(Math.random() * columns)
        if (!bombArray[randomRow][randomColumn]) {
            bombArray[randomRow][randomColumn] = 1
            bombsPlaced++
        }
    }
    return bombArray
}

const markAllHiddenBombs = () => {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const currentTile = document.getElementById(`${i},${j}`)
            if (currentTile.src.includes("/minesweeper/blank.png") && bombArray[i][j]) {
                currentTile.src = "/minesweeper/bomb_revealed.png"
            }
        }
    }
}

const gameOver = (row, column) => {
    const grid = document.getElementById("game-grid")
    grid.childNodes.forEach((tile) => {
        tile.disabled = "disabled"
    })
    document.querySelector("#smiley > input").src = "/minesweeper/face_dead.png"
    const gameOverDiv = document.getElementById("gameover")
    const gameOverText = document.createElement("p")
    gameOverText.innerHTML = "Game over!"
    gameOverDiv.appendChild(gameOverText)
    document.getElementById(`${row},${column}`).src = "/minesweeper/bomb_death.png"
    markAllHiddenBombs()
}

const checkBombAdjacency = (row, column) => {
    let adjacencyCounter = 0
    let rowMinBound = -1
    let rowMaxBound = 2
    let columnMinBound = -1
    let columnMaxBound = 2
    if (row === 0) {
        rowMinBound = 0
    }
    if (row === rows-1) {
        rowMaxBound = 1
    }
    if (column === 0) {
        columnMinBound = 0
    }
    if (column === columns-1) {
        columnMaxBound = 1
    }
    for (let i = rowMinBound; i < rowMaxBound; i++) {
        for (let j = columnMinBound; j < columnMaxBound; j++) {
            if (bombArray[row+i][column+j]) {
                adjacencyCounter++
            }
        }
    }
    return adjacencyCounter
}

const openTile = (event) => {
    const [row, column] = event.target.id.split(",").map((num) => {return Number(num)})
    if (bombArray[row][column]) {
        gameOver(row, column)
    } else {
        // set number in tile of adjacent bombs
        const adjacentBombs = checkBombAdjacency(row, column)
        document.getElementById(`${row},${column}`).src = `/minesweeper/num_${adjacentBombs}.png`
    }
    checkBombAdjacency(row, column)
}

const flag = (event) => {
    event.target.src = event.target.src.includes("/minesweeper/blank.png") ? "/minesweeper/bomb_flagged.png" : "/minesweeper/blank.png"
    if (event.target.src.includes("/minesweeper/bomb_flagged.png")) {
        bombTotal--;
    } else {
        bombTotal++;
    }
    updateBombTimer()
    event.preventDefault()
    return false;
}

const clearGrid = () => {
    document.getElementById("game-grid").innerHTML = ""
    bombArray = []
    document.querySelector("#smiley > input").src = "/minesweeper/face_smile.png"
    document.getElementById("gameover").innerHTML = ""
    bombTotal = 40
    createBoard()
}

const createBoard = () => {
    const grid = document.getElementById("game-grid")
    const bombs = [document.getElementById("bomb-1"), document.getElementById("bomb-2")]
    bombs.forEach((bomb, index) => {
        const currentDigit = bombTotal.toString()[index]
        bomb.src = `/minesweeper/${currentDigit}_seconds.png`
    })
    // make empty 2d array
    for (let i = 0; i < rows; i++) {
        let innerArray = []
        for (let j = 0; j < columns; j++) {
            innerArray.push(0)
        }
        bombArray.push(innerArray)
    }
    bombArray = makeBombs(bombArray)
    bombArray.forEach((subArray, rowIndex) => {
        subArray.forEach((_, columnIndex) => {
            const tile = document.createElement("input")
            tile.type = "image"
            tile.src = "/minesweeper/blank.png"
            tile.draggable = false
            tile.onclick = openTile
            tile.oncontextmenu = flag
            tile.id = `${rowIndex},${columnIndex}`
            grid.appendChild(tile)
        })
    })

}

document.addEventListener("DOMContentLoaded", createBoard)
document.querySelector("#smiley > input").addEventListener("click", clearGrid)