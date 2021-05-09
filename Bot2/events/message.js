require('dotenv').config();
const Discord = require('discord.js');

module.exports = {
	name: 'message',
	isAsync: true,
	async execute(message, client) {
        try {
            if (message == null || message.channel == null || message.channel.guild == null) return;
            if (message.author.bot) return;

            const prefix = process.env.DEFAULT_PREFIX;

            // Commands part
            if (message.content.toLowerCase().startsWith(prefix.toLowerCase())) {
                const args = message.content.slice(prefix.length).trim().split(/ +/g);
                const commandName = args.shift().toLowerCase();
                const command = getCommand(client.commands, commandName);
                if (command == null) return

                if (command.permissions) {
                    const authorPerms = message.channel.permissionsFor(message.author);
                    if (!authorPerms || !authorPerms.has(command.permissions))
                        return message.reply('You do not have the permission to use this command.');
                }

                if (command.args && !args.length) {
                    let reply = `This command requires arguments.`;
                    if (command.usage) 
                        reply += `\nProper usage: \`${prefix}${command.name} ${command.usage}\``;
                    return message.channel.send(reply);
                }

                return await command.execute(message, args);
            }
            // Other messages part
        } catch (e) {
            console.log(e);
        }
	},
};

function getCommand(client, commands) {
    return commands.get(command) 
        || commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

}