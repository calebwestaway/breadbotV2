const messages = require('./randomMsg.json');
const { client, midnightChl } = require('./index.js');

const cron = require('node-cron');

let previousIndex = -1;
let randomIndex = Math.floor(Math.random() * messages.length);

function selectMsg(arr) {
    while (randomIndex === previousIndex) {
        randomIndex = Math.floor(Math.random() * arr.length);
    }
    previousIndex = randomIndex;

    return arr[randomIndex];
};

cron.schedule('0 3 * * *', () => {
    try {
        msg = selectMsg(messages);
        console.log('Sending message to ' + midnightChl + ': "' + msg + '"');
        client.channels.cache.get(midnightChl).send(msg);
    } catch (error) {
        console.error(error);
    };
});
