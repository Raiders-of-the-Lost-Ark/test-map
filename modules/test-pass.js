var crypto = require('crypto');

var sha512 = function(password, salt){
    var hash =  crypto.createHmac('sha512', salt);
    hash.update(password);

    var value = hash.digest('hex');
    return value;
};

module.exports = function checkPassHash(inputPass, userSalt, userHash){
    var inputHash = sha512(inputPass, userSalt);
    if(inputHash == userHash){
        return true;
    } else {
        return false;
    }
}