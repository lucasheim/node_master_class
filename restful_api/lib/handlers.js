/*
*
*   Request handlers
*
*/

// Dependencies
var validations = require ('./validations');
var _data = require('./data');
var helpers = require('./helpers');

// Define the handlers
var handlers = {};

// Users
handlers.users = function(data, callback) {
    var acceptableMethods = ["post", "get", "put", "delete"];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for users submethods
handlers._users = {};

// Users post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = function(data, callback) {
    // Check that all required fields are filled out
    var firstName = validations.validateName(data.payload.firstName);
    var lastName = validations.validateName(data.payload.lastName);
    var phone = validations.validatePhone(data.payload.phone);
    var password = validations.validateName(data.payload.password);
    var tosAgreement = validations.validateTosAgreement(data.payload.tosAgreement);

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure that the user doesnt already exists
        _data.read("users", phone, function(error, data) {
            if(error) {
                // Hash the password
                var hashedPassword = helpers.hash(password);
                if(hashedPassword) {

                    // Create the user object
                    var userObject = {
                        "firstName": firstName,
                        "lastName": lastName,
                        "phone": phone,
                        "hashedPassword": hashedPassword,
                        "tosAgreement": true
                    };

                    // Store the user
                    _data.create("users", phone, userObject, function(err) {
                        if(!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {"Error": "Could not create the new user"});
                        }
                    });
                } else {
                    callback(500, {"Error": "Could not hash password"});
                }
            } else {
                 // User already exists
                 callback(400, {"Error": "A user with that phone number already exists"});
            }
        });
    } else {
        callback(400, {"Error" : "Missing required fields"});
    }
};

// Users get
// Required data: phone
// Optional data: none
// @TODO only let an authenticated user access their object.
handlers._users.get = function(data, callback) {
    // Check that the phone number is valid
    var phone = validations.validatePhone(data.queryStringObject.phone);
    if (phone) {
        // Lookup the user
        _data.read("users", phone, function(err, data) {
            if(!err && data) {
                // Remove the hashed password from the user object before returning
                delete data.hashedPassword;
                callback(200, data);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, {"Error": "Missing required fields"});
    }
};

// Users put
// Required data: phone
// Optional data: firstName, lastName, password (at least one must be specified)
// @TODO Only let an authenticated user update their object
handlers._users.put = function(data, callback) {
    // Check for the required field
    var phone = validations.validatePhone(data.payload.phone);
    
    // Check for the optoinal fields
    var firstName = validations.validateName(data.payload.firstName);
    var lastName = validations.validateName(data.payload.lastName);
    var password = validations.validateName(data.payload.password);

    if(phone) {
        // Error if nothing is sent to update
        if (firstName || lastName || password) {
            _data.read("users", phone, function(err, userData) {
                if(!err && userData) {
                    // Update the fields that are necessary
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.hashedPassword = helpers.hash(password);
                    }

                    // Store the new updates
                    _data.update("users", phone, userData, function(err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {"Error": "Could not update the user"});
                        }
                    });
                } else {
                    callback(400, {"Error": "The specified user does not exist"});
                }
            });
        } else {
            callback(400, {"Error": "Missing fields to update"});
        }
    } else {
        callback(400, {"Error": "Missing required field"});
    }
};

// Users delete
// Required field: phone
// @Todo Only let an authenticated user delete their object
// @TODO Delete any other data files associated with this user
handlers._users.delete = function(data, callback) {
    // Check that the phone number is valid
    var phone = validations.validatePhone(data.queryStringObject.phone);
    if (phone) {
        // Lookup the user
        _data.read("users", phone, function(err, data) {
            if(!err && data) {
                _data.delete("users", phone, function(err) {
                    if(!err) {
                        callback(200);
                    } else {
                        callback(500, {"Error": "Could not delete the specified user"});
                    }
                });
            } else {
                callback(400, {"Error": "Could not find the specified user"});
            }
        });
    } else {
        callback(400, {"Error": "Missing required fields"});
    }
};

// Tokens
handlers.tokens = function(data, callback) {
    var acceptableMethods = ["post", "get", "put", "delete"];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for all the tokens methods
handlers._tokens = {};

// Tokens - post
// Required data: phone, password
// Optional data: none
handlers._tokens.post = function(data, callback) {
    var phone = validations.validatePhone(data.payload.phone);
    var password = validations.validateName(data.payload.password);
    if (phone && password) {
        // Lookup the user who matches that phone number
        _data.read("users", phone, function(err, userData) {
            if(!err && userData) {
                // Hash the sent password, and compare it to the password stored
                var hashedPassword = helpers.hash(password);
                if (hashedPassword === userData.hashedPassword) {
                    // If valid create a new token with a random name. Set expiration date 1 hour
                    var tokenId = helpers.createRandomString(20);
                    var expires = Date.now() + 1000 * 60 * 60;
                    var tokenObject = {
                        "phone": phone,
                        "id": tokenId,
                        "expires": expires
                    };

                    // Store the token
                    _data.create("tokens", tokenId, tokenObject, function(err) {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {"Error": "Could not create the new token"});
                        }
                    });

                } else {
                    callback(400, {"Error": "Password did not match the specified user\'s password"})
                }
            } else {
                callback(400, {"Error": "Could not find specified user"});
            }
        });

    } else {
        callback(400, {"Error": "Missing required fields"});
    }
    
};

// Tokens - get
handlers._tokens.get = function(data, callback) {

};

// Tokens - put
handlers._tokens.put = function(data, callback) {

};

// Tokens - delete
handlers._tokens.delete = function(data, callback) {

};

// Ping handler
handlers.ping = function(data, callback) {
    callback(200);
};

// Not found handler
handlers.notFound = function(data, callback) {
    callback(404);
};

// Export the handlers
module.exports = handlers;