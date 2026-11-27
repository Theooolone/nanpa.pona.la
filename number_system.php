<?php
// Remove when done
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('log_errors', '1');

require __DIR__ . "/vendor/autoload.php";
use Yosymfony\Toml\Toml;

$id = $_GET["id"] ?? "";

// prevent funky stuff like trying to go to "../" or navigate thru subfolders
if (!preg_match("/^[a-z0-9_-]{1,64}$/", $id)) {
	http_response_code(404);
	exit('Not found');
}
$path = __DIR__ . "/systems/$id/";
$file = $path . "system.toml";
if (!is_file($file)) {
	http_response_code(404);
	exit('Not found');
}

$system = Toml::ParseFile($file);
$description = is_file($path . "description.html") ? file_get_contents($path . "description.html") : "<p><i class=\"semi\">Description not found!</i></p>";

$display_article = @$system["display_article"] ?: $system["display"];

$py_impl_included = is_file($path . "py_impl.txt");
$js_impl_included = is_file($path . "js_impl.txt");
$any_impl_included = $py_impl_included or $js_impl_included;

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title><?=$system["display"]?></title>
	<link rel="stylesheet" href="/style.css">
	<style>
		html, body {
			margin: 0;
			height: 100%;
		}
	</style>
	<script src="/number_system.js"></script>
	<script src="/systems/<?=$id?>/impl.js"></script>
	<?php if($any_impl_included): ?><link rel="stylesheet" href="https://gen-w-deja.github.io/prism-themes/themes/prism-atom-dark.css"><?php endif; ?>
</head>
	<body>
		<div id="split">
			<div class="pane" id="left">
				<h1><?=$system["display"]?></h1>
				<?=$description?>
				<div class="tabview">
					<ul class="tabview-nav">
						<li class="selected"><a href="javascript:;"><span>Fact Sheet</span></a></li>
						<li><a href="javascript:;"><span>Specification</span></a></li>
						<?php if($py_impl_included): ?><li><a href="javascript:;"><span>Python Implementation</span></a></li><?php endif; ?>
						<?php if($js_impl_included): ?><li><a href="javascript:;"><span>JavaScript Implementation</span></a></li><?php endif; ?>
					</ul>
					<div class="tabview-content">
						<div style="display: block;">
							<table class="pu-table">
								<tr>
									<td><b>Creator</b></td>
									<td><?=$system["creator"]?></td>
								</tr>
								<tr>
									<td><b>Publish date</b></td>
									<td><?=$system["published"]?></td>
								</tr>
								<tr>
									<td><b>Type</b></td>
									<td><?=$system["type"]?></td>
								</tr>
								<tr>
									<td><b>Defines</b></td>
									<td><?=$system["set"]?> <small class="semi" title="All numbers that have a precise representation in <?=$display_article?>">&#x1F6C8;</small></td>
								</tr>
								<tr>
									<td><b>Usage</b></td>
									<td><?=$system["usage"]?></td>
								</tr>
								<tr>
									<td><b>Based on</b></td>
									<td><?=$system["based_on"]?></td>
								</tr>
							</table>
						</div>
						<div style="display: none;"><?php foreach ($system["specification"] as $item): ?><div class="quote-indent"><?=file_get_contents($path . $item["file"])?></div><p><?=$item["source"]?></p><?php endforeach; ?></div>
						<?php if($py_impl_included): ?>
							<div style="display: none;"><pre><code class="language-python"><?=htmlspecialchars(file_get_contents($path . "py_impl.txt"))?></code></pre></div>
						<?php endif; ?>
						<?php if($js_impl_included): ?>
							<div style="display: none;"><pre><code class="language-javascript"><?=htmlspecialchars(file_get_contents($path . "js_impl.txt"))?></code></pre></div>
						<?php endif; ?>
					</div>
				</div>
				<div style="display:flex;">
				<?php if(isset($system["sona_pona"])): ?><p style="flex:1;text-align:right;"><a href="https://sona.pona.la/wiki/<?=$system["sona_pona"]?>">sona pona</a></p><?php endif; ?>
				</div>
			</div>
			<div class="pane" id="right">
				<h1>Tools</h1>
				<p>Convert to <?=$display_article?>:</p>
				<input id="to_input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
				<p id="to_output">(Output here)</p><br>
				<p>Convert from <?=$display_article?>:</p>
				<input id="from_input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
				<p id="from_output">(Output here)</p>
			</div>
		</div>
		<script>
		document.querySelectorAll(".tabview").forEach(function (tabview) {
			var tabs = tabview.querySelectorAll(".tabview-nav li");
			var contents = tabview.querySelectorAll(".tabview-content > div");

			tabview.querySelector(".tabview-nav").addEventListener("click", function (e) {
				var link = e.target.closest("a");
				if (!link) return;
				e.preventDefault();

				var tab = link.parentElement;
				var index = Array.prototype.indexOf.call(tabs, tab);
				if (index === -1) return;

				tabs.forEach(function (t, i) {
					t.classList.toggle("selected", i === index);
				});
				contents.forEach(function (c, i) {
					c.style.display = i === index ? "block" : "none";
				});
			});
		});
		</script>
		<?php if($any_impl_included): ?><script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script><?php endif; ?>
		<?php if($py_impl_included): ?><script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script><?php endif; ?>
		<?php if($py_impl_included): ?><script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script><?php endif; ?>
	</body>
</html>
