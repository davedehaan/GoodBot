module.exports = {
    getDescription: () => {
        return 'Delete to command message and X messages above it.';
    },
	run: (client, message, args) => {

		if (!args[0]) {
			return false;
		}
		if (!client.permission.manageChannel(message.member, message.channel)) {
			return false;
		}
			
		let messageLimit = 20;
		if (typeof(args[0] !==  'undefined')) {
			messageLimit = parseInt(args[0]);
		}
		if (messageLimit > 20) { messageLimit = 20; }
		setTimeout(() => {
			message.channel.messages.fetch({limit: messageLimit})
			.then(function(list){
				message.channel.bulkDelete(list).catch(() => {
					let counter = 0;
					list.forEach((message) => {
						counter++;
						setTimeout(async() => {
							await message.delete();
						}, counter * 1000);
					});
				});
			});
		}, 1500);
	}
}