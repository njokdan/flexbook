/* 
This file should be hidden from public as it contains both salt and the secret key for token generation.
*/

const bcrypt = require('bcrypt');

const salt = '$2b$10$sbR90pvCTCpM5HspdS5yxu';

const encryptPass = async (plain_pass) => { 

    const hashed = await bcrypt.hash(plain_pass, salt)

    return hashed
}

secret_key = 'AD#%G4&^*398!$YJ'

module.exports = [encryptPass, secret_key];