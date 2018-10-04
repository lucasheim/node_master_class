var validations = {};

validations.validateName = function(name) {
    if (isString(name) && isNotBlank(name.trim())) {
        return name.trim();
    }
    return false;
};

validations.validatePhone = function(phoneNumber) {
    if (isString(phoneNumber) && hasPhoneLenght(phoneNumber.trim())) {
        return phoneNumber.trim();
    }
    return false;
};

validations.validateTosAgreement = function(tosAgreement) {
    return typeof(tosAgreement) === "boolean" && tosAgreement;
};

validations.validateId = function(id) {
    if (isString(id) && hasIdLength(id.trim())) {
        return id.trim();
    }
    return false;
}

function hasIdLength(id) {
    return id.length === 20;
}

function hasPhoneLenght(phoneNumber) {
    return phoneNumber.length === 10;
}

function isNotBlank(string) {
    return string.length > 0;
};  

function isString(string) {
    return typeof(string) === "string";
};

function isBoolean(boolean) {
    return typeof(boolean) === "boolean";
};

module.exports = validations;