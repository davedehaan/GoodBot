module.exports = (client, message) => {
	console.log('(GB) -- Startup complete @ ' + client.timestamp.get());
	console.log('(GB) ===========================================================================')
	console.log('(GB) [' + client.timestamp.get() + '] ' + client.config.botname + ' has started on ' + client.guilds.cache.size + ' servers.'); 
	client.user.setActivity(client.config.botactivity, {type: 'WATCHING'});
};
