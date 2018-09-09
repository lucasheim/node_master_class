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

// Export the modules
module.exports = helpers;