if (process.argv[2] == 'global') {
    const { REST, Routes } = require('discord.js');
    const { clientId, token } = require('./config.json');
    const fs = require('node:fs');
    const path = require('node:path');

    const commands = [];
    // Grab all the command folders from the commands directory you created earlier
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        // Grab all the command files from the commands directory you created earlier
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs
            .readdirSync(commandsPath)
            .filter(file => file.endsWith('.js'));
        // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                if (!command.excludeFromDeploy || !command.guildDeploy) {
                    commands.push(command.data.toJSON());
                } else {
                    console.log(
                        `Skipping deployment for command at ${filePath} due to 'excludeFromDeploy' or 'guildDeploy' attribute.`,
                    );
                }
            } else {
                console.log(
                    `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
                );
            }
        }
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(token);

    // and deploy your commands!
    (async () => {
        try {
            console.log(
                `Started refreshing ${commands.length} application (/) commands.`,
            );

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(Routes.applicationCommands(clientId), {
                body: commands,
            });

            console.log(
                `Successfully reloaded ${data.length} application (/) commands.`,
            );
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();
} else if (process.argv[2] == 'guild') {
    const { REST, Routes } = require('discord.js');
    const { clientId, guildId, token } = require('./config.json');
    const fs = require('node:fs');
    const path = require('node:path');

    if (process.argv[3]) {
        const commands = [];
        // Grab all the command folders from the commands directory you created earlier
        const foldersPath = path.join(__dirname, 'commands');
        const commandFolders = fs.readdirSync(foldersPath);

        for (const folder of commandFolders) {
            // Grab all the command files from the commands directory you created earlier
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs
                .readdirSync(commandsPath)
                .filter(file => file.endsWith('.js'));
            // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                // Check if the command has 'guildDeploy' property set to true
                if (
                    'data' in command &&
                    'execute' in command &&
                    command.guildDeploy === true
                ) {
                    commands.push(command.data.toJSON());
                } else {
                    console.log(
                        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property, or 'guildDeploy' is not set to true.`,
                    );
                }
            }
        }

        // Construct and prepare an instance of the REST module
        const rest = new REST().setToken(token);

        // and deploy your commands!
        (async () => {
            try {
                console.log(
                    `Started refreshing ${commands.length} application (/) commands.`,
                );

                // The put method is used to fully refresh all commands in the guild with the current set
                const data = await rest.put(
                    Routes.applicationGuildCommands(clientId, process.argv[3]),
                    { body: commands },
                );

                console.log(
                    `Successfully reloaded ${data.length} application (/) commands.`,
                );
            } catch (error) {
                // And of course, make sure you catch and log any errors!
                console.error(error);
            }
        })();
    } else {
        console.error('No guild ID provided!');
    }
} else if (process.argv[2] == 'delete') {
    // Thanks, ChatGPT!

    const { REST, Routes } = require('discord.js');
    const { clientId, token } = require('./config.json');

    const rest = new REST({ version: '10' }).setToken(token);

    (async () => {
        try {
            const commandType = process.argv[3]; // Command line argument (global, guild, both)

            if (
                !commandType ||
                !['global', 'guild', 'both'].includes(commandType.toLowerCase())
            ) {
                console.error(
                    'Invalid command type. Please provide "global", "guild", or "both" as a command line argument.',
                );
                return;
            }

            let guildIds = [];

            if (
                commandType.toLowerCase() === 'both' ||
                commandType.toLowerCase() === 'guild'
            ) {
                // Extract additional arguments as guild IDs
                guildIds = process.argv.slice(4);
            }

            console.log(
                `Started deleting ${commandType}-specific application (/) commands.`,
            );

            if (
                commandType.toLowerCase() === 'both' ||
                commandType.toLowerCase() === 'global'
            ) {
                // Delete all global commands
                const globalCommands = await rest.get(
                    Routes.applicationCommands(clientId),
                );

                for (const command of globalCommands) {
                    await rest.delete(
                        Routes.applicationCommand(clientId, command.id),
                    );
                    console.log(`Deleted global command "${command.name}"`);
                }
            }

            if (
                commandType.toLowerCase() === 'both' ||
                commandType.toLowerCase() === 'guild'
            ) {
                for (const guildId of guildIds) {
                    const guildCommands = await rest.get(
                        Routes.applicationGuildCommands(clientId, guildId),
                    );

                    // Delete all server-specific commands for the specified guild
                    for (const command of guildCommands) {
                        await rest.delete(
                            Routes.applicationGuildCommand(
                                clientId,
                                guildId,
                                command.id,
                            ),
                        );
                        console.log(
                            `Deleted server-specific command "${command.name}" in guild "${guildId}"`,
                        );
                    }
                }
            }

            console.log(
                `Successfully deleted ${commandType}-specific application (/) commands.`,
            );
        } catch (error) {
            console.error(error);
        }
    })();
} else {
    console.log(
        "Invalid parameters. Please provide 'global', 'guild' or 'delete",
    );
}
