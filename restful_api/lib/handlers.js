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
handlers._users.get = function(data, callback) {
    
};

// Users put
handlers._users.put = function(data, callback) {
    
};

// Users delete
handlers._users.delete = function(data, callback) {
    
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