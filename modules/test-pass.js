var crypto = require('crypto');

    // similar function to one in generate pass, but
    // instead of returning an object it just returns the hash
var sha512 = function(password, salt){
    var hash =  crypto.createHmac('sha512', salt);
    hash.update(password);

    var value = hash.digest('hex');
    return value;
};

    // export a function that takes in a current salt, hash and user input
    // it tests the outputed hash from sha512 and checks the result
module.exports = function checkPassHash(inputPass, userSalt, userHash){
    var inputHash = sha512(inputPass, userSalt);

        // return true if the input was correct, false if not
    if(inputHash == userHash){
        return true;
    } else {
        return false;
    }
}