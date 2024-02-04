module.exports = {
    splitString(inputString) {
        const regex = /\s+(?=(?:(?:[^']*'){2})*[^']*$)/; // Split on spaces, but not within single quotes
    
        return inputString.split(regex)
            .map(item => item.replace(/'/g, '')); // Remove single quotes from each item
    }
}
