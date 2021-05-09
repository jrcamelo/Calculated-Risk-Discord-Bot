require('dotenv').config();

module.exports = {
	name: 'ready',
	once: true,
	isAsync: true,
	async execute(client) {
		console.log(`Bot has started, with ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
        await client.user.setActivity(`${process.env.PREFIX}help`);
	},
};