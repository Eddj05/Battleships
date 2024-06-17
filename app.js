document.addEventListener('DOMContentLoaded', () => {
    const currentPlayer = document.body.getAttribute('data-current-player');
    const confirmButton = document.querySelector(`#confirm-${currentPlayer}`);
    const undoButton = document.querySelector('#undo-button');
    const startButton = document.querySelector('#start_button');

    confirmButton.disabled = true; // disable the confirm button initially



    const gamesBoardContainer = document.querySelector('#gamesboard-container');
    const optionContainer = document.querySelector('.option-container');
    const flipButton = document.querySelector('#flip-button');

    let angle = 0;
    let placementHistory = [];
    let draggedShip;
    let notDropped;
    let shipsPlaced = 0; // Track the number of placed ships
    let player1Placed = false; // Initialize player1Placed variable
    let player2Placed = false; // Initialize player2Placed variable

    function flip(event) {
        event.preventDefault();
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
    function undoLastPlacement(event) {
        console.log("Undo button clicked");
        event.preventDefault();
        console.log("Default action prevented");
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

    undoButton.addEventListener('click', undoLastPlacement);


    function collectTakenBlocks() {
        const takenBlocks = [];
        const blocks = document.querySelectorAll('.block');
        blocks.forEach(block => {
            if (block.classList.contains('taken')) {
                takenBlocks.push(block.id);
            }
        });
        return takenBlocks;
    }

    confirmButton.addEventListener('click', (event) => {
        event.preventDefault();

        const takenBlocks = collectTakenBlocks();

        // Determine the player based on the file path
        let player;
        const currentPath = window.location.pathname;
        if (currentPath.includes('player1.php')) {
            player = 'player1';
        } else if (currentPath.includes('player2.php')) {
            player = 'player2';
        } else {
            console.error('Unknown player file path:', currentPath);
            return;
        }

        // Create a new XMLHttpRequest object
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'save-placements.php', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        // Send the request with the takenBlocks array and player information as JSON
        const data = {
            player: player,
            takenBlocks: takenBlocks
        };
        xhr.send(JSON.stringify(data));

        // Handle response
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log('Placements saved successfully.');
            } else {
                console.error('Failed to save placements:', xhr.statusText);
            }
        };

        xhr.onerror = function () {
            console.error('Network error occurred while sending placements.');
        };
    });

    startButton.addEventListener('click', (event) => {
        event.preventDefault();
        fetchPlayerData();
    });

    function fetchPlayerData() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'placements.json', true);

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.responseText);
                processPlayerBlocks(data.player1, data.player2); // Adjust as per your JSON structure
            } else {
                console.error('Failed to fetch data:', xhr.statusText);
            }
        };

        xhr.onerror = function () {
            console.error('Network error occurred while fetching data.');
        };

        xhr.send();
    }

    function processPlayerBlocks(player1Blocks, player2Blocks) {
        // Process player blocks as needed
        console.log('Player 1 Blocks:', player1Blocks);
        console.log('Player 2 Blocks:', player2Blocks);
    }
});