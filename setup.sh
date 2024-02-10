#!/bin/bash

read -p "Run setup script? You must have Node installed: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd "$(git rev-parse --show-toplevel)"

    if ! [ -f temp.json ]; then
        echo "{}" > temp.json
        echo "Created temp.json"
    else
        echo "Found temp.json, skipping"
    fi

    if ! [ -f config.json ]; then
        echo '
{
    "token": "insert token here",
    "clientId": "insert client id here"
}
        ' > config.json
        echo "Created config.json"
    else
        echo "Found config.json, skipping"
    fi

    if ! [ -f channels.json ]; then
        touch channels.json
        echo "Created channels.json."
    else
        echo "Found channels.json, skipping"
    fi
    
    echo "Installing required packages via npm"
    npm install
    wait

    echo "Setup complete!"
    echo "Please fill in config.json with the correct data"

elif [[ $REPLY =~ ^[Nn]$ ]]; then
    echo "Not running setup script"
fi
