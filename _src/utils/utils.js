const crypto = require('crypto');

const handleError = (res, status, message) => {
    console.error(message);
    return res.status(status).json({error: message});
};

// Generates a UID with format PREFIX_XXXXXX
const generateUID = (prefix) => {
    const randomBytes = crypto.randomBytes(3);
    const hexString = randomBytes.toString('hex').toUpperCase();
    return `${prefix}_${hexString}`;
};

module.exports = {
    handleError,
    generateUID
};