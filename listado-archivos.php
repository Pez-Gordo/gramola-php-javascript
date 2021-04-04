<?php

$files = scandir('./audio');
//echo '<pre>';
//var_dump($files);
//echo '</pre>';

exit(json_encode($files));

?>