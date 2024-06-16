document.addEventListener('DOMContentLoaded', () => {
    const currentPlayer = document.body.getAttribute('data-current-player');
    const confirmButton = document.querySelector(`#confirm-${currentPlayer}`);
    const undoButton = document.querySelector('#undo-button');
    const startButton = document.querySelector('#start_button');

    confirmButton.disabled = true; // disable the confirm button initially

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

// Event listener for the confirm placement button
    confirmButton.addEventListener('click', (event) => {
        console.log("Button clicked");
        event.preventDefault();
        console.log("Default action prevented");
        const takenBlocks = collectTakenBlocks();
        console.log("The array of taken ID's:", takenBlocks);

        // Determine the player based on the file path
        let player;
        const currentPath = window.location.pathname;
        if (currentPath.includes('player1.php')) {
            player = 'player1';
        } else if (currentPath.includes('player2.php')) {
            player = 'player2';
        } else {
            console.error('Unknown player file path:', currentPath);
            return; // Exit the function if player cannot be determined
        }
        console.log('Player determined from file path:', player);

        // Create a new XMLHttpRequest object
        const xhr = new XMLHttpRequest();

        // Configure it: POST-request for the URL /save-placements.php
        xhr.open('POST', 'save-placements.php', true);

        // Set the request header to indicate JSON data
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        // Send the request with the takenBlocks array and player information as JSON
        const data = {
            player: player,
            takenBlocks: takenBlocks
        };
        xhr.send(JSON.stringify(data));

        // Optional: Add event listeners for success and error handling
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log('The placements have been saved successfully.');
            } else {
                console.log('Failed to save the placements:', xhr.statusText);
            }
        };
        xhr.onerror = function () {
            console.log('Network error occurred while sending placements.');
        };
    });

    function fetchPlayerData() {
        // Create a new XMLHttpRequest object
        const xhr = new XMLHttpRequest();

        // Configure it: GET-request for the URL /placements.json
        xhr.open('GET', 'placements.json', true);

        // Send the request
        xhr.send();

        // Event listener for when the request completes
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log('Data fetched successfully.');
                const data = JSON.parse(xhr.responseText);
                console.log('Received data:', data);

                // Initialize arrays for player data
                let player1Blocks = [];
                let player2Blocks = [];

                // Populate arrays with data
                if (data.player1) {
                    player1Blocks = data.player1;
                }
                if (data.player2) {
                    player2Blocks = data.player2;
                }

                // Log the lists or use them as needed
                console.log('Player 1 Blocks:', player1Blocks);
                console.log('Player 2 Blocks:', player2Blocks);

                // Use the lists in your application as needed
                // For example, you might want to call another function to process these lists
                processPlayerBlocks(player1Blocks, player2Blocks);

            } else {
                console.log('Failed to fetch data:', xhr.statusText);
            }
        };

        xhr.onerror = function () {
            console.log('Network error occurred while fetching data.');
        };
    }

// Dummy function to process the player blocks
    function processPlayerBlocks(player1Blocks, player2Blocks) {
        // Process the lists as needed in your application
        // For example, you might update the UI or perform other actions
        console.log('Processing player blocks...');
        console.log(player1Blocks, player2Blocks    );
        // Your code here
    }

    // Event listener for the start button
    startButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default action
        console.log("Start button clicked and default action prevented");
        fetchPlayerData();
    });

});