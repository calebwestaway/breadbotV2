#!/bin/bash

cd "$(git rev-parse --show-toplevel)"

read -p "Run setup script? You must have Node v16.11.0 or higher: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    cd "$(git rev-parse --show-toplevel)"

    echo "{
    }" > temp.json
    echo "Created temp.json"

    echo "
    {
	    "token": "insert token here",
	    "clientId": "inset client id here"
    }
    " > config.json
    echo "Created config.json"

    touch channels.json
    echo "Created channel.json."

    echo "Running channelScanner.js"
    node functions/channelScanner.js

    wait

    echo "Installing required packages"
    npm install

    wait

    echo "Setup complete!"
    echo "Please fill in config.json with the correct data"

elif [[ $REPLY =~ ^[Nn]$ ]]
then
    echo "Not running setup script"
fi
