const os = require('os')

const { client, logChl } = require('./index.js');
const bootMessage = 'Ready!';

console.log('Sending boot message to ' + logChl + ': ' + bootMessage);
client.channels.cache.get(logChl).send(bootMessage);

if (process.env.PM2_HOME) {
    msg = ' with PM2'
} else {
    msg = ' without PM2'
}

client.channels.cache.get(logChl).send(
    'Running on ' + os.hostname().replace('.local', '') + msg
);
