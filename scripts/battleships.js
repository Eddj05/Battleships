// initiate variables
let gridSize = 10;
let myGrid = createGrid(gridSize);

// print the grid
printGrid(myGrid);

//function to create the grid
function createGrid() {
    // initialize an empty array
    let grid= [];
    for (let i = 0; i < gridSize; i++){
        // create a row
        grid[i] = [];
        for (let j = 0; j < gridSize; j++){
            // fill each cell with '-'
            grid[i][j] = '-';
        }
    }
    return grid;
}

// function to print the grid to the page
function printGrid(grid, isEnemy = false) {
    // create a container div
    const container = document.createElement('div');
    // set the display style to grid
    container.style.display = 'grid';
    // define the number of columns in the grid
    container.style.gridTemplateColumns = `repeat(${grid.length + 1}, auto)`;
    container.style.gap = '5px';

    // create headers for the rows
    const headers = createHeaders(grid.length);
    container.appendChild(headers);

    for (let i = 0; i < grid.length; i++) {
        // create a row header div
        const rowHeader = document.createElement('div');
        // make headers for each row (1-10)
        rowHeader.textContent = i + 1;
        container.appendChild(rowHeader);

        for (let j = 0; j < grid[i].length; j++) {
            // create a div for each cell
            const cell = document.createElement('div');
            // set the text content to the cell value, or '-' if it's an enemy grid and the cell is 'O'
            cell.textContent = isEnemy && grid[i][j] == 'O' ? '-' : grid[i][j];
            cell.style.border = '1px solid black';
            cell.style.padding = '10px';
            cell.style.textAlign = 'center';
            container.appendChild(cell);
        }
    }

    // add the container to the body of the document
    document.body.appendChild(container);
}

// function to create the header row
function createHeaders(size) {
    const headerRow = document.createDocumentFragment(); // make a fragment to hold the header elements
    const emptyCorner = document.createElement('div'); // make empty corner cell (top left of the table)
    headerRow.appendChild(emptyCorner); // add the empty corner to the header row

    for (let i = 0; i < size; i++) {
        const headerCell = document.createElement('div'); // make a div for each header cell
        headerCell.textContent = String.fromCharCode(65 + i); // set the text content to the column letter (A, B, C, ...)
        headerCell.style.textAlign = 'center';
        headerRow.appendChild(headerCell); // add the header cell to the header row
    }

    return headerRow;
}