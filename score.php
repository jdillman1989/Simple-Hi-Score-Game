<?php
$file = '/var/www/drupal/game/scores.json';

$player = $_GET["data"];

$current = file_get_contents($file);

$update = substr($current, 0, -1);

$update .= $player;

$update .= ",]";

file_put_contents($file, $update);

echo $player;
?>