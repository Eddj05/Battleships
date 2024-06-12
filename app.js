document.addEventListener('DOMContentLoaded', () => {
    const currentPlayer = document.body.getAttribute('data-current-player');
    const confirmButton = document.querySelector(`#confirm-${currentPlayer}`);
    const undoButton = document.querySelector('#undo-button');

    confirmButton.disabled = true; // disable the confirm button initially

    confirmButton.addEventListener('click', (event) => confirmPlacement(event, currentPlayer));
    undoButton.addEventListener('click', undoLastPlacement);

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
        event.preventDefault();
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

    const startButton = document.querySelector('#start_button');
    startButton.disabled = true; // Disable the start button initially


    function confirmPlacement(event, player) {
        event.preventDefault();
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

        console.log('Confirming placement for:', player);
        console.log('Taken blocks:', takenBlocks);
        saveData(data);

        // Save placement data to local file
        savePlacementDataLocally(player, takenBlocks);

        // Enable the start button immediately after the player confirms their placements
        if (player === 'player1') {
            player1Placed = true;
        } else if (player === 'player2') {
            player2Placed = true;
        }

        startButton.disabled = false; // Enable the start button
    }

    // Function to save placement data locally in player's HTML file
    function savePlacementDataLocally(player, takenBlocks) {
        const data = {
            player: player,
            takenBlocks: takenBlocks
        };
        // Fetch existing data or initialize as an empty array if none exists
        let existingData = localStorage.getItem('placements') ? JSON.parse(localStorage.getItem('placements')) : [];
        // Append new data
        existingData.push(data);
        // Save updated data back to local storage
        localStorage.setItem('placements', JSON.stringify(existingData));
    }

// Check if ship placement data exists for both players upon game start
    function checkShipPlacementData() {
        const player1DataExists = checkPlacementDataExists('player1');
        const player2DataExists = checkPlacementDataExists('player2');

        if (player1DataExists && player2DataExists) {
            startButton.disabled = false; // Enable the start button
        }
    }

// Function to check if ship placement data exists locally for a player
    function checkPlacementDataExists(player) {
        const fileName = player + '.html';

        // Use browser's local storage or file system API to check data existence
        // Example: return localStorage.getItem(player + '_placementData') !== null;

        // For demonstration purposes, assume data exists if player's HTML file exists
        return checkFileExists(fileName);
    }

// Function to check if a file exists
    function checkFileExists(fileName) {
        // Implementation depends on the environment (e.g., browser or Node.js)
        // For a web environment, you can use fetch or XMLHttpRequest to check file existence
        // Example: return fetch(fileName).then(response => response.ok);
    }

// Add event listener to the "Start Game" button
    startButton.addEventListener('click', () => {
        // Check if both players have confirmed their placements before starting the game
        if (player1Placed && player2Placed) {
            console.log('Starting game...'); // Log message indicating game start
            // Add your game start logic here
        } else {
            console.log('Cannot start game yet. Both players must confirm placements.');
        }
    });

// Call the function to check ship placement data upon game initialization
    checkShipPlacementData();

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

// Log ship placements for both players
    function logShipPlacements() {
        const player1Placements = JSON.parse(localStorage.getItem('placements')).filter(data => data.player === 'player1');
        const player2Placements = JSON.parse(localStorage.getItem('placements')).filter(data => data.player === 'player2');

        console.log('Player 1 ship placements:', player1Placements);
        console.log('Player 2 ship placements:', player2Placements);
    }

// Add event listener to the "Start Game" button
    startButton.addEventListener('click', () => {
        // Check if both players have confirmed their placements before starting the game
        if (player1Placed && player2Placed) {
            console.log('Starting game...'); // Log message indicating game start

            // Call the function to log ship placements
            logShipPlacements();

            // Add your game start logic here
        } else {
            console.log('Cannot start game yet. Both players must confirm placements.');
        }
    });
});