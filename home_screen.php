<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>Battleships</title>
        <link rel="preconnect" href="https://cdnjs.cloudflare.com">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/4.6.1/css/bootstrap.min.css" integrity="sha512-T584yQ/tdRR5QwOpfvDfVQUidzfgc2339Lc8uBDtcp/wYu80d7jwBgAxbyMh0a9YM9F8N3tdErpFI8iaGx6x5g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <link rel="stylesheet" href="css/style.css">
    </head>
    <?php include "tpl/body_start.php" ;?>
        <h3> Welcome to Battleships! </h3>
        <h4> Press the button to start the game or view the rules!</h4>
        <div id="startup">
            <a id="start_button" class="button" href ="choose_player.php">Start Game!</a>
            <a id="rules_button" class="button" href ="rules.php">How to play</a>
        </div>
    </body>
</html>