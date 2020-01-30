const fs = require("fs");
const Discord = require("discord.js");

exports.run = (client, message, args) => {
	if (!message.guild) {
		return false;
	}
	message.delete().catch(O_o=>{}); 

	if (!args[0]) {
		return false;
	}

	const player = args.shift().toLowerCase();

	let raidCategory = client.customOptions.get(message.guild, 'raidcategory');
	if (!raidCategory) {
		return message.channel.send('Unable to modify raid.  Please create a channel category called "Raid Signups" to use this command, or use +setoption to set a "raidcateory" value. ' + raidCategory);
	}

	let category = message.guild.channels.find(c => c.name == raidCategory.trim() && c.type == "category");
	if (!category) {
		return message.channel.send('Unable to modify raid.  Please create a channel category called "Raid Signups" to use this command, or use +setoption to set a "raidcateory" value. ' + raidCategory);
	}

	// Retrieve this user's permission for the raid category
    let permissions = category.permissionsFor(message.author);
	if (!permissions.has("MANAGE_CHANNELS")) {
		return message.channel.send('You do not have the manage channels permission for "' + raidCategory + '".  Unable to complete command.');
	}

	// Write to class json file
	const fileName = './signups/' + message.guild.id + '-' + message.channel.name + '.json';
	let parsedFile = {};
	if (fs.existsSync(fileName)) {
		file = fs.readFileSync(fileName, 'utf8');
		parsedFile = JSON.parse(file);
	}
	if (!parsedFile.confirmed) {
		parsedFile.confirmed = [];
	}
	if (parsedFile.confirmed.indexOf(player) == -1) {
		parsedFile.confirmed.push(player);
		fs.writeFileSync(fileName, JSON.stringify(parsedFile)); 
		message.author.send('Confirmed ' + player + ' for ' + message.channel.name + '.');
	} else {
		message.author.send('Player was already confirmed.');
	}
	client.embed.update(message, message.channel.name);
};