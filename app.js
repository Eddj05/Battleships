const gamesBoardContainer = document.querySelector('#gamesboard-container')
const optionContainer = document.querySelector('.option-container')
const flipButton = document.querySelector('#flip-button')

let angle = 0
function flip() {
    const optionShips = Array.from(optionContainer.children)
    if (angle === 0) {
        angle = 90
    } else {
        angle = 0
    }
    optionShips.forEach(optionShip => optionShip.style.transform = `rotate(${angle}deg)`)
}

// create board
const  width = 10

function createBoard(color) {
    const gameBoardContainer = document.createElement('div')
    gameBoardContainer.classList.add('game-board')
    gameBoardContainer.style.backgroundColor = color

    gamesBoardContainer.append(gameBoardContainer)
}
createBoard('lightblue')
createBoard('lightsteelblue')

flipButton.addEventListener('click', flip)