<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Battleships <?php echo $currentPlayer; ?> </title>
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/4.6.1/css/bootstrap.min.css" integrity="sha512-T584yQ/tdRR5QwOpfvDfVQUidzfgc2339Lc8uBDtcp/wYu80d7jwBgAxbyMh0a9YM9F8N3tdErpFI8iaGx6x5g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="css/style.css">
</head>
<body data-current-player="<?php echo $currentPlayer; ?>">
<?php include "tpl/header.php";?>

<div id="game-info">
    <p>Turn: <span id="turn-display"></span></p>
    <p>Info: <span id="info"></span></p>
</div>

<div class="show-player-container">
    <div class="show-player-container">
        <div class="player-title">
            <h3>Player 1:</h3>
        </div>
        <div class="player-title">
            <h3>Player 2:</h3>
        </div>
    </div>
</div>

<div id="gamesboard-container"></div>

<div class="option-container">
    <div id="0" class="destroyer-preview destroyer" draggable="true"></div>
    <div id="1" class="submarine-preview submarine" draggable="true"></div>
    <div id="2" class="cruiser-preview cruiser" draggable="true"></div>
    <div id="3" class="battleship-preview battleship" draggable="true"></div>
    <div id="4" class="carrier-preview carrier" draggable="true"></div>
</div>

<div class="button-container">
    <button id="flip-button">FLIP</button>
    <button id="undo-button">UNDO</button>
    <button id="confirm-<?php echo $currentPlayer; ?>" class="confirm-button">CONFIRM PLACEMENT</button>
    <button id="start_button">START</button>
</div>

<script src="app.js"></script>
</body>
</html>
