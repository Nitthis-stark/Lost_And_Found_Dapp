// hardhat.config.cjs
const path = require("path");

// Explicitly load .env from the same folder as hardhat.config.cjs
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

require("@nomicfoundation/hardhat-toolbox");

const privateKey = process.env.SYSTEM_PRIVATE_KEY;
const ganacheUrl = process.env.GANACHE_URL;

if (!privateKey || !ganacheUrl) {
    throw new Error('Please set SYSTEM_PRIVATE_KEY and GANACHE_URL in your .env file');
}

module.exports = {
    solidity: '0.8.20',
    networks: {
        ganache: {
            url: ganacheUrl,
            accounts: [privateKey],
        },
    },
};
