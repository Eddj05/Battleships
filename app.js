document.addEventListener('DOMContentLoaded', () => {
    const currentPlayer = document.body.getAttribute('data-current-player');
    const confirmButton = document.querySelector(`#confirm-${currentPlayer}`);
    const undoButton = document.querySelector('#undo-button');

    confirmButton.disabled = true; // disable the confirm button initially

    confirmButton.addEventListener('click', () => confirmPlacement(currentPlayer));
    undoButton.addEventListener('click', undoLastPlacement);

    const gamesBoardContainer = document.querySelector('#gamesboard-container');
    const optionContainer = document.querySelector('.option-container');
    const flipButton = document.querySelector('#flip-button');

    let angle = 0;
    let placementHistory = [];
    let draggedShip;
    let notDropped;
    let shipsPlaced = 0; // Track the number of placed ships

    function flip() {
        const optionShips = Array.from(optionContainer.children);
        angle = angle === 0 ? 90 : 0;
        optionShips.forEach(optionShip => optionShip.style.transform = `rotate(${angle}deg)`);
    }

    flipButton.addEventListener('click', flip);

    // create board
    const width = 10;

    function createBoard(color, user) {
        const gameBoardContainer = document.createElement('div');
        gameBoardContainer.classList.add('game-board');
        gameBoardContainer.style.backgroundColor = color;
        gameBoardContainer.id = user + '-board'; // Assign unique id

        for (let i = 0; i < width * width; i++) {
            const block = document.createElement('div');
            block.classList.add('block');
            block.id = i;
            gameBoardContainer.append(block);
        }

        gamesBoardContainer.append(gameBoardContainer);
    }
    createBoard('lightblue', 'player1');
    createBoard('lightsteelblue', 'player2');

    // create ships
    class Ship {
        constructor(name, length) {
            this.name = name;
            this.length = length;
        }
    }

    const destroyer = new Ship("destroyer", 2);
    const submarine = new Ship("submarine", 3);
    const cruiser = new Ship("cruiser", 3);
    const battleship = new Ship("battleship", 4);
    const carrier = new Ship('carrier', 5);

    const ships = [destroyer, submarine, cruiser, battleship, carrier];

    function getValidity(allBoardBlocks, isHorizontal, startIndex, ship) {
        let validStart = isHorizontal ? startIndex <= width * width - ship.length ? startIndex :
                width * width - ship.length :
            startIndex <= width * width - width * ship.length ? startIndex :
                startIndex - ship.length * width * width;

        let shipBlocks = [];

        for (let i = 0; i < ship.length; i++) {
            if (isHorizontal) {
                shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
            } else {
                shipBlocks.push(allBoardBlocks[Number(validStart) + i * width]);
            }
        }

        let valid;

        if (isHorizontal) {
            shipBlocks.every((_shipBlock, index) =>
                valid = shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1)));
        } else {
            shipBlocks.every((_shipBlock, index) =>
                valid = shipBlocks[0].id < 90 + (width * index + 1));
        }

        const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains("taken"));

        return { shipBlocks, valid, notTaken };
    }

    function addShipPiece(user, ship, startId) {
        let allBoardBlocks = document.querySelectorAll(`#${user}-board div`);
        let isHorizontal = angle === 0;
        let startIndex = startId;

        const { shipBlocks, valid, notTaken } = getValidity(allBoardBlocks, isHorizontal, startIndex, ship);

        if (valid && notTaken) {
            shipBlocks.forEach(shipBlock => {
                shipBlock.classList.add(ship.name);
                shipBlock.classList.add("taken");
            });
            placementHistory.push({ ship, shipBlocks });
            shipsPlaced++;

            if (shipsPlaced === ships.length) {
                confirmButton.disabled = false;
            }
        } else {
            if (user === 'player1' || user === 'player2') notDropped = true;
        }
    }

    const optionShips = Array.from(optionContainer.children);
    optionShips.forEach(optionShip => optionShip.addEventListener('dragstart', dragStart));

    const allPlayer1Blocks = document.querySelectorAll('#player1-board div'); // Use unique id
    const allPlayer2Blocks = document.querySelectorAll('#player2-board div'); // Use unique id

    function addEventListeners(playerBlocks, player) {
        playerBlocks.forEach(playerBlock => {
            playerBlock.addEventListener("dragover", dragOver.bind(null, player));
            playerBlock.addEventListener('drop', dropShip.bind(null, player));
        });
    }

    // Add event listeners to the respective player's blocks
    addEventListeners(allPlayer1Blocks, 'player1');
    addEventListeners(allPlayer2Blocks, 'player2');

    function dragStart(e) {
        notDropped = false;
        draggedShip = e.target;
    }

    function dragOver(user, e) {
        e.preventDefault();
        if (user === currentPlayer) {
            const ship = ships[draggedShip.id];
            highlightArea(user, e.target.id, ship);
        }
    }

    function dropShip(user, e) {
        if (user === currentPlayer) {
            const startId = e.target.id;
            const ship = ships[draggedShip.id];
            addShipPiece(user, ship, startId);
            if (!notDropped) {
                draggedShip.remove();
            }
        }
    }

    function highlightArea(user, startIndex, ship) {
        const allBoardBlocks = document.querySelectorAll(`#${user}-board div`); // Use unique id
        let isHorizontal = angle === 0;
        const { shipBlocks, valid, notTaken } = getValidity(allBoardBlocks, isHorizontal, startIndex, ship);

        if (valid && notTaken) {
            shipBlocks.forEach(shipBlock => {
                shipBlock.classList.add("hover");
                setTimeout(() => shipBlock.classList.remove('hover'), 500);
            });
        }
    }

    // undo the last ship placement
    function undoLastPlacement() {
        if (placementHistory.length === 0) return;

        const lastPlacement = placementHistory.pop();
        const { ship, shipBlocks } = lastPlacement;

        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.remove(ship.name);
            shipBlock.classList.remove("taken");
        });

        shipsPlaced--; // Decrement the number of placed ships

        // Disable the confirm button if not all ships are placed
        confirmButton.disabled = true;

        // Add the ship back to the options container
        const shipElement = document.createElement('div');
        shipElement.id = ships.indexOf(ship).toString(); // Convert number to string
        shipElement.classList.add('ship', `${ship.name}-preview`, ship.name);
        shipElement.draggable = true;
        optionContainer.appendChild(shipElement);
        shipElement.addEventListener('dragstart', dragStart);
    }

    function confirmPlacement(player) {
        const allBlocks = document.querySelectorAll(`#${player}-board .block`);
        const takenBlocks = [];

        allBlocks.forEach(block => {
            if (block.classList.contains('taken')) {
                takenBlocks.push(block.id);
            }
        });

        const data = {
            player: player,
            takenBlocks: takenBlocks
        };

        console.log('Confirming placement for:', player); // Debugging line
        console.log('Taken blocks:', takenBlocks); // Debugging line

        saveData(data);
    }

    function saveData(data) {
        fetch('server.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
});