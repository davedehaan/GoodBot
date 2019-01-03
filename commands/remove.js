const fs = require("fs");

exports.run = (client, message, args) => {
	// Allow a user to sign up in the sign-up channel
	if (message.channel.name.indexOf('signup') == -1) {
		message.channel.send("This command can only be used in a sign-up channel.");
		return false;
	}
	message.delete().catch(O_o=>{}); 
	
	const raid = message.channel.name;
	const user = args[0] ? args[0] : message.member.displayName;
	const userName = user.charAt(0).toUpperCase() + user.slice(1).toLowerCase();

	
	const fileName = '/tmp/' + raid + '.json';
	let parsedLineup = {};
	if (fs.existsSync(fileName)) {
		currentLineup = fs.readFileSync(fileName, 'utf8');
		parsedLineup = JSON.parse(currentLineup);
	}
	
	delete parsedLineup[userName];
	fs.writeFileSync(fileName, JSON.stringify(parsedLineup));
	
	client.updateEmbed(message, raid);
}