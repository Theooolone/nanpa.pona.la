<?php
// Remove when done
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('log_errors', '1');

require __DIR__ . "/vendor/autoload.php";
use Yosymfony\Toml\Toml;

$systems = [];

foreach (glob("systems/*") as $path) {
	$systems[basename($path)] = Toml::ParseFile(__DIR__ . "/" . $path . "/system.toml");
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>nanpa.pona.la</title>
	<link rel="stylesheet" href="/style.css">
</head>
<body>
	<h1>nanpa.pona.la</h1>
	<p>lipu nanpa.pona.la li pona ala lon tenpo ni. mi awen pali e ona! :3<br>sina wile sona namako la o lukin e <a href="https://discord.com/channels/972470770443886662/1565266843810136144">tomo pi lipu nanpa.pona.la</a> lon <a href="https://discord.gg/A3ZPqnHHsy">pali pona</a> (ma pi ilo Siko)</p>
	<p>nanpa.pona.la is unfinished and still in development! :3<br>If you'd like more info, check out the <a href="https://discord.com/channels/972470770443886662/1565266843810136144">nanpa.pona.la thread</a> in the <a href="https://discord.gg/A3ZPqnHHsy">pali pona</a> Discord server</p>
	<ul><?php foreach($systems as $id => $system): ?><li><a href="/<?=$id?>"><?=$system["display"]?></li><?php endforeach; ?></ul>
	<a href="https://github.com/Theooolone/nanpa.pona.la">GitHub</a>
</body>
</html>
