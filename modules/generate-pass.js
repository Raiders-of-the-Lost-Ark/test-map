// header generate pass stuff


var crypto = require('crypto');

//  Generate a random string to use as a salt for
//  password hashing.
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex')
        .slice(0, length);
}

/*  Use a one-way encryption function, it takes in a inputted password
    and a randomly generated salt.  This then returns an object
    with a salt and hash. */
var sha512 = function(password, salt){

        // run the pass through our encryption algorithm (sha512)
    var hash =  crypto.createHmac('sha512', salt);
    hash.update(password);

    var value = hash.digest('hex');
        // return an object with a salt and hash
    return {
        salt:salt,
        passwordHash:value
    };
};

    // Export a function to be used on our server

    
module.exports = function saltHashPassword(userpassword){
    var salt = genRandomString(16);
    var passwordData = sha512(userpassword, salt);
    return passwordData;
}