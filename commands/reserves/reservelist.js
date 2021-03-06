const { Op } = require('sequelize');
const moment = require('moment');

exports.run = async function(client, message, args) {
    let channel = message.channel;
    let raid = await client.raid.get(client, channel);
    let guildID = message.guild.id;
    if (!raid) {
        return message.author.send("This command is only usable from a raid channel.");
    }
    if (!raid.softreserve) {
        return message.author.send("Soft reserve is not currently enabled for this raid.");
    }

    let sendTo = message.author;
	if (client.permission.manageChannel(message.member, message.channel) && args[0] == 'channel') {
        sendTo = message.channel;
    }

    includes = [
        {model: client.models.signup, as: 'signup', foreignKey: 'signupID'},
        {model: client.models.reserveItem, as: 'item', foreignKey: 'reserveItemID'},
    ];
    
    client.models.raidReserve.findAll({where: {RaidID: raid.id}, include: includes}).then(async (raidReserves) => {
        let reserves = [];
        let reserveHistory;
        if (args[0] && args[0] == 'history') {
            reserveHistory = await client.raid.getReserveHistory(client, guildID, raid, args[1]);
        }
        for (key in raidReserves) {
            let raidReserve = raidReserves[key];
            if (raidReserve.signup) {
                reserves.push(raidReserve);
            }
        }

        sendTo.send('```diff\n+ Raid: \n- ' + channel.name + '```');
        let returnMessage = '';
        reserves.sort((a, b) => {
            if (!a.signup || !b.signup) {
                return 0;
            }
            if (a.item.name > b.item.name) {
                return 1;
            }
            if (a.item.name < b.item.name) {
                return -1;
            }
            if (a.signup.player > b.signup.player) {
                return 1;
            }
            if (a.signup.player < b.signup.player) {
                return -1;
            }
            return 0;
        });
        reserves.forEach((reserve) => {
            if (reserve.signup && reserve.signup.signup == 'yes') { 
                if (!returnMessage.length) {
                    returnMessage = '-\n```md\n';
                    returnMessage += 'Player'.padEnd(20) + 'Item'.padEnd(50) +  'Reserved At'.padEnd(30);
                    if (args[0] && args[0] == 'history') {
                        returnMessage += 'Times Reserved';
                    }
                    returnMessage += '\n';
                    returnMessage += ''.padEnd(120, '-') + '\n';
                }
                returnMessage += reserve.signup.player.padEnd(20) + reserve.item.name.padEnd(50) + moment(reserve.updatedAt).utcOffset(-240).format('h:mm A, L').padEnd(30);
                if (args[0] && args[0] == 'history') {
                    if (reserveHistory[reserve.signup.player] && reserveHistory[reserve.signup.player][reserve.item.id]) {
                        returnMessage += reserveHistory[reserve.signup.player][reserve.item.id].count; 
                    } else {
                        returnMessage += '0';
                    }
                }
                returnMessage += '\n';
                if (returnMessage.length > 1800) {
                    returnMessage += '```';
                    sendTo.send(returnMessage);    
                    returnMessage = '';
                }
            }
        });
        if (returnMessage.length) {
            returnMessage += '```';
            sendTo.send(returnMessage);    
        }
    });
};