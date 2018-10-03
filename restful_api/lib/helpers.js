/*
* Helpers for several tasks (fucking utils)
*
*/

// Dependecies
var crypto = require('crypto');
var validations = require('./validations');
var config = require("./config");

// Container for all the helpers
var helpers = {};

// Create a SHA256 hash
helpers.hash = function(string) {
    if(validations.validateName(string)) {
        var hash = crypto.createHmac("sha256", config.hashingSecret)
                         .update(string)
                         .digest("hex");
        return hash;
    } else {
        return false;
    }
};

// Parse a JSON string to an object in all cases without throwing
helpers.parseJsonToObject = function(string) {
    try{
        var object = JSON.parse(string);
        return object;
    } catch(e){
        return {};
    }
};

// Create a string of random alphanumeric characters of a given length
helpers.createRandomString = function(strLength) {
    strLength = typeof(strLength) === "number" && strLength > 0 ? strLength : false;
    if (strLength) {
        // Define all the possible characters that could go into the string
        var possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

        // Start the final string
        var str = "";

        for (var i = 1; i <= strLength; i++) {
            // Get a random character from the possible ones
            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // Append this character to the final string
            str += randomCharacter;
        }

        return str;
    } else {
        return false;
    }
}

// Export the modules
module.exports = helpers;