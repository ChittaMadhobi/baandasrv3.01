const bcrypt = require('bcrypt');

// We create salt. Salt is a random string that is added before the hash so the 
// result cannot be found out via hashing a set of passwords, hash and compare them.

// console.log('inside hash');

async function pwdHashed(pwd) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(pwd, salt);

    return hashed;
}

module.exports = pwdHashed;