function customToString(value) {
    // Check if the value is a string
    if (typeof value === 'string') {
      return value; // Return the string as is
    }
  
    // For non-string values, convert them to a string using String()
    return String(value);
}

module.exports = { customToString };
