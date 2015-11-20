<?php
$scoreFile = "scores.json";
$fh = fopen($scoreFile, 'w') or die("can't open file");
$stringData = $_GET["data"];
fwrite($fh, $stringData);
fclose($fh)
?>