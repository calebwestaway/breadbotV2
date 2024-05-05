const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, messageLink } = require('discord.js');
const readline = require('readline');

const { token } = require('./config.json');

const { splitString } = require('./functions/splitString.js');
const scanChannels = require('./functions/channelScanner.js');
const findReplace = require('./functions/findReplace.js');
// const compileKeys = require('./functions/compileKeys.js');

function compileKeys(jsonArray, keyName) {
    const compiledList = {};
    jsonArray.forEach(obj => {
        const keys = Object.keys(obj);
        keys.forEach(key => {
            if (key === keyName) {
                if (!compiledList[obj[key]]) {
                    compiledList[obj[key]] = [];
                }
                compiledList[obj[key]].push(obj);
            }
        });
    });
    return compiledList;
}

const servers = require('./channels.json');
const { connect } = require('node:http2');
const logChl = servers["Bread Bot's House"].channels.log;

const stringsToEdit = [
    {
        "find": "shit",
        "replace": "||shit||"
    },
    {
        "find": "fuck",
        "replace": "||fuck||"
    }
]

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
});

module.exports.client = client;

client.cooldowns = new Collection();
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    scanChannels(client)
        .then(() => {
            console.log('Scanning completed!');
            require('./startup.js');
        })
        .catch(error => {
            console.error('Error:', error);
        });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.on('line', input => {
        // get command
        const splitInput = splitString(input);
        const command = splitInput[0];

        if (command == 'msg') {
            if (splitInput[1] == 'help' || splitInput[1] == 'h') {
                console.log('msg text channelId');
            } else {
                try {
                    client.channels.cache.get(String(splitInput[2])).send(splitInput[1]);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    });
});

client.on('messageCreate', msg => {
    if (msg.author.bot && msg.author !== client.user.username) return;

    console.log(msg.author.username + ': ' + msg.content);
    if (msg.content.includes(client.user.id)) {
        msg.reply('Hello <@' + msg.author + '>');

    } else if (msg.content.includes("editMe")) {

        let findQuery = stringsToEdit.map(obj => obj['find']);
        let editedMsg = msg.content;

        for (let item of stringsToEdit) {
            if (findQuery.every(value => msg.content.toLowerCase().includes(value))) {
                msg.delete();
                client.channels.cache.get(msg.channelId).send(`
                ${msg.author} says:
                > ${editedMsg}
                `);
                editedMsg = undefined;
            } else if (editedMsg.toLowerCase().includes(item.find.toLowerCase())) {
                editedMsg = editedMsg.replace(item.find, item.replace);
            }
        }



        // if surrounding this with foundOneMatch that triggers above, modified for loop
        // actually might not need that at all and not have surrounding if at all

        // (scoping for above to not block out var names bc they are common) if possible

        // editedContent = findReplace(stringsToEdit, msg.content);


    }
})

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    const { cooldowns } = client;

    if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldownDuration = 3;
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

    if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
            const expiredTimestamp = Math.round(expirationTime / 1000);
            return interaction.reply({
                content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
                ephemeral: true,
            });
        }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        });
    }
});

client.login(token);

module.exports = { client, logChl };
