# nanpa.pona.la
The source code for https://nanpa.pona.la/, a website compiling many Toki Pona number systems and providing conversion tools.

To run locally:
1. Install PHP
2. Clone the repository
3. Run `php -S localhost:8000` in the repository directory
4. Go to http://localhost:8000 in your browser.

Note that the rewrite rules in `.htaccess` require a full webserver. For these to work, you can create a Docker container or something. No tutorial on that here because I have no idea how to do that.
Using the described method above, you can manually change all `/XYZ` paths to `/number_system.php?id=XYZ` when navigating to them.

To propose changes, chat in the [nanpa.pona.la thread](https://discord.com/channels/972470770443886662/1565266843810136144) in [pali pona](https://discord.gg/A3ZPqnHHsy) on Discord.
To make changes, fork the repository, edit your fork, then create a pull request.

Changes made to the main branch are automatically pushed to the server.

*o ijo nanpa pona!*
