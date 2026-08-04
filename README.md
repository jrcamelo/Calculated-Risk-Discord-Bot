![profile](https://i.imgur.com/VOYltPg.png)  
Calculated Risk is a bot that helps host image board Risk games on Discord.  
It makes tracking easier both for the game master and the players.  


The features are:
- Channel based games
- Turn management
- Rolls with message IDs
- Special roll highlights
- Alliances
- Leaderboards
- Levels
- ...and a lot more

## Slash commands

Set `BOT_TOKEN`, `CLIENT_ID`, and optionally `DEV_GUILD_ID` in `.env`.

- Development guild deploy: `npm run deploy:guild-commands`
- Global deploy: `npm run deploy:commands`

Slash commands use each command's primary name only, for example `/roll`, `/startgame`, and `/help`.
