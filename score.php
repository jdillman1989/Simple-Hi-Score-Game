<?php
$file = 'scores.json';
$player = $_GET["data"];
file_put_contents($file, $player, FILE_APPEND | LOCK_EX);
?>