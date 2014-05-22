<?php
	$pass = '';

	$GLOBALS['PASS'] = 'vaitercopaS1M';
	session_start();
	if (isset($_POST['pass'])) {
		$pass = $_POST['pass'];
	}

	if (isset($_SESSION)) {
		if (isset($_SESSION['pass'])) {
			$pass = $_SESSION['pass'];
		}
	}
	
	if ($pass != $GLOBALS['PASS']) {
		header("Location: login.php");
		session_destroy();
		exit;
	} else if ($pass !== ''){
		$_SESSION['pass'] = $pass;
	}
?>
<!DOCTYPE HTML>
<html lang="pt-BR">
<head>
	<meta charset="UTF-8">
	<title>Mano a Mano</title>
	
	<link href='http://fonts.googleapis.com/css?family=Lobster' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="css/style.css" />
</head>
<body>
	<div id="wrapper">
		<h1>Mano a Mano</h1>
		
		<!-- <button id="start">Começar</button> -->
		
		<ol id="player" class="deck"></ol>
		
		<ol id="computer" class="deck"></ol>

		<div id="game-mode-modal" class="modal display-none">
			<ul class="game-options">
				<li data-mode="definedRounds">
					<span  class="modal-option">Partida rápida</span>
				</li>
				<li data-mode="complete">
					<span class="modal-option">Partida completa</span>
				</li>
			</ul>
		</div>
	</div>

	<script type="text/javascript" src="js/jquery-1.11.0.min.js"></script>
	<script type="text/javascript" src="js/StartModal.js"></script>
	<script type="text/javascript" src="js/Player.js"></script>
	<script type="text/javascript" src="js/Computer.js"></script>
	<script type="text/javascript" src="js/GameModeModule.js"></script>
	<script type="text/javascript" src="js/GameMaster.js"></script>
</body>
</html>