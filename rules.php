<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title> Rules Battleships</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
<div id="header">
    <div class="header-content">
        <img src="Images/battleship2.png" alt="Battleship">
        <a href="home_screen.php" class="homepage"> <h1>Battleships</h1> </a>
        <img src="Images/battleship2_reverse2.png" alt="Battleship">
    </div>
</div>
<div class="rules">
    <h2> Rules</h2>
    <p>
        Each ship occupies a number of consecutive squares on the grid, arranged either horizontally or vertically.
        The number of squares for each ship is determined by the type of ship.
    </p>
    <p>
        The ships cannot overlap (i.e., only one ship can occupy any given square in the grid).
        The types and numbers of ships allowed are the same for each player.
    </p>
    <p>
        After the ships have been positioned, the game proceeds in a series of rounds.
    </p>
    <p>
        In each round, each player takes a turn to click on a target square in the opponent's grid which is to be shot at.
        When there is a boat on that square, this will be announced.
    </p>
    <p>
        When all the squares of a ship have been hit, the ship's owner announces the sinking of the Battleship, specifying which Battleship it was.
        If all of a player's ships have been sunk, the game is over and their opponent wins.
    </p>
    <p>
        Good luck playing the game!
    </p>
    <a href="home_screen.php" class="button">Go back to the homepage</a>
    <a href="choose_player.php" class="button">Start game!</a>
</div>


</body>
</html>