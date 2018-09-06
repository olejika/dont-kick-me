const Discord = require('discord.js');
const client = new Discord.Client();

var prefix = '!'
client.on('message', (message) => {
    if (message.content.startsWith(prefix + 'ping')) {
        message.reply('Pong!').then(function (msg) {
            msg.edit('Pong! ' + (msg.createdTimestamp - message.createdTimestamp).toString() + 'ms');
        });
    }
});

client.on('ready', () => {
    client.channels.get('484082569370009621').send('@everyone Hello, Stream World!');
    var second = setInterval(calculate, 1000);
});

//TWITCH BEGIN

const tmi = require('tmi.js');

let opts = {
    options: { debug: false },
    connection: { cluster: 'aws', reconnect: true },
    identity: {
        username: 'olejika',
        password: 'oauth:95gs7tmwnr1bd3pxl4er9daui48kqs'
    },
    channels: ['dontkickthedog']
};

const twitchClient = new tmi.client(opts);
twitchClient.connect();

twitchClient.on('message', function (channel, userstate, msg, self) {
    notificate(userstate.username, msg)
});

// TWITCH END

var fs = 0;
var points = 0;
var golden = 0; //                small //                      good //                         great //                            epic //
var bonesPoints = [60, 180, 420, 780, 1260, 1860, 2460, 3060, 3660, 4260, 6060, 8160, 10560, 13260, 16860, 21060, 26460, 33060, 40860, 49860,
//                                       legendary //                             amazing //                              fantastic //
                    60660, 73260, 87660, 103860, 121860, 150000, 180000, 210000, 240000, 270000, 300000, 400000, 500000, 600000, 750000,
//                           incredible 3 //
                    1000000, 1500000, 2000000]
var nextBone = 0;
var items = [];
var itemsAbbs = ['OB', 'LP', 'NH', 'G ', 'SP', 'HT', 'S ', 'YT'];
var itemsNamesR = ['Officer\'s Badge I', 'Lock Pick I', 'Ninja\'s Hood I', 'Gavel I', 'Sinister Plan I', 'Hearty Treat I', 'Steak I', 'Yummy Treat I'];
var kick = false;

function notificate(nick, msg) {
    // 'STREAM' CHANNEL
    if (nick == 'dktdbot' && !msg.startsWith('BARK!') && !msg.startsWith('How to play:'))
        client.channels.get('484082569370009621').send(msg);


    // NOTIFICATION CHANNEL

    var notification = '';

    if (nick == 'dktdbot' && !msg.startsWith('BARK!')) {
        if (msg.includes('achieved')) {
            var bonesNames = ['Small', 'Good', 'Great', 'Epic', 'Legendary', 'Amazing', 'Fantastic', 'Incredible'];
            var words = msg.split(' ');
            if (boneToNumber(words[0], words[2]) >= boneToNumber('Epic', 'V')) {
                notification = `Golden dog! **${words[0]}** Bone **${words[2]}** achieved!`;
            }
            var bone = boneToNumber(words[0], words[2])
            if (!bonesNames.includes(words[0])) bonesNames.push(words[0]);
            if (bone < bonesPoints.length) {
                points = points < bonesPoints[bone] ? bonesPoints[bone] : points;
                nextBone = bone < bonesPoints.length && bone > 0 ? bonesPoints[bone + 1] : nextBone;
            }

            golden = 60;
        }
        else if (msg.includes('finished their Golden Pets')) {
            var words = msg.split(' ');
            fs += parseInt(words[7]);
        }
        else if (msg == 'The dog is leaving in 60 seconds.') {
            notification = '**Kicked!** The dog is leaving in 60 seconds.';
            kick = true;
        }
        else if (msg == 'The dog decided to stay because of all the pets.') {
            kick = false;
        }
        else if (msg.startsWith('The dog has left!')) {
            var words = msg.split(' ');
            notification = `Time's up! **The dog has left** with final score** ${(parseInt(words[7].replace(/,/g, '')) * parseInt(words[4])).toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2')} points** and** ${fs} friendship**`
            points = 0
            fs = 0
            kick = false
        }
        else if (msg.includes('points to the Dog!') && golden == 0) {
            var words = msg.split(' ');

            var pts = parseInt(words[4].replace(/,/g, ''));
            switch (words[2]) {
                case 'I]':
                    if (pts != Math.floor((fs + 200) * 3 / 10))
                        fs = Math.ceil((pts - 60) * 10 / 3);
                    break;
                case 'II]': fs = Math.ceil((pts - 300) * 2 / 3); break;
                case 'III]': fs = Math.ceil((pts - 900) * 2 / 9); break;
            }
            points += pts;
        }
        else if (msg.includes('friendship to the Dog!')) {
            var words = msg.split(' ');
            fs += parseInt(words[4]);
        }
        else if (msg.startsWith('The Dog is satisfied by all the pets')) {
            fs += 10;
        }
        else if (msg.includes('which is now up for grabs!') || msg.includes('dropped a')) {
            var item = msg.slice(msg.indexOf("[") + 1, msg.indexOf("]"));
            items.push([itemsAbbs[itemsNamesR.indexOf(item)], 119])
        }
        else if (msg.includes('claimed')) {
            var itemsNames = ['Officer\'s Badge', 'Lock Pick', 'Ninja\'s Hood', 'Gavel', 'Sinister Plan', 'Hearty Treat', 'Steak', 'Yummy Treat'];
            var item = msg.slice(msg.indexOf("[") + 1, msg.indexOf("]"));
            var itemToDelete = itemsAbbs[itemsNames.indexOf(item)];
            for (var i = items.length - 1; i >= 0; i--)
                if (items[i][0] == itemToDelete) {
                    items.splice(i, 1); break;
                }
        }
    }
    //NOTIFICATION CHANNEL
    if (notification != '') client.channels.get('483617345378713600').send('@everyone ' + notification);
}

function calculate() {
    if (golden > 0)
        golden--;
    else if (!kick)
        points = Math.round(200 * points + fs + 200) / 200;

    var pointsString = points.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2')
    var sp = pointsString.includes('.') ? pointsString.indexOf('.') + 4 - pointsString.length : 4
    for (var a = 0; a < sp; a++)         pointsString = pointsString + ' ';
    for (; pointsString.length < 13;)   pointsString = ' ' + pointsString;

    var fsString = fs.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2')
    for (; fsString.length < 5;) fsString = ' ' + fsString;

    var timerNum = Math.ceil(200 * (nextBone - points) / (fs + 200));
    var timerStr = timerNum >= 0 ? `${Math.floor(timerNum / 60)} mins ${timerNum % 60} secs` : 'I don\'t know'

    for (var i = 0; i < items.length; i++) {
        items[i][1]--;
        if (items[i][1] == 0) { items.splice(i, 1); fs++; }
    }
    var itemsString = ''
    for (var i = 0; i < items.length; i++) {
        itemsString += items[i][0] + '=' + items[i][1] + ' '
    }
    itemsString.slice(-1);

    // client.channels.get('484955411695403020').send('```'+pointsString+'pts, '+fsString+' fs, '+(golden==0 ? timerStr : 'golden = '+golden)+'```');
    console.log(pointsString + 'pts, ' + fsString + ' fs, ' + (golden == 0 ? timerStr : 'golden = ' + golden));
    console.log(itemsString);
}

function boneToNumber(name, roman) {
    var romanNums = ['I', 'II', 'III', 'IV', 'V']
    var bonesNames = ['Small', 'Good', 'Great', 'Epic', 'Legendary', 'Amazing', 'Fantastic', 'Incredible'];
    return bonesNames.indexOf(name) * 5 + romanNums.indexOf(roman);
}

client.login(process.env.BOT_TOKEN);
