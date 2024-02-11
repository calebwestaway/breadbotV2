const { client, logChl } = require('./index.js');
const bootMessage = 'Ready!';

console.log('Sending boot message to ' + logChl + ': ' + bootMessage);
client.channels.cache.get(logChl).send(bootMessage);

if (process.env.PM2_HOME) {
    client.channels.cache.get(logChl).send('Using PM2');
} else {
    client.channels.cache.get(logChl).send('Not using PM2');
}
