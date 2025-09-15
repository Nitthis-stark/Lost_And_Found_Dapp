// services/tokenService.js
import hardhat from "hardhat";


import dotenv from "dotenv";
dotenv.config();

export async function mintTokens(userAddress, amountTokens) {
    const { ethers } = hardhat;
    try {
        // Get deployer/system account
        const [deployer] = await ethers.getSigners();

        // Attach to deployed contract
        const tokenAddress = process.env.TOKEN_CONTRACT_ADDRESS;
        const Token = await ethers.getContractFactory("FindToken");
        const token = Token.attach(tokenAddress);

        // Convert to token decimals
        const amount = ethers.parseUnits(amountTokens.toString(), 18);

        // Call mint function
        const tx = await token.mint(userAddress, amount);
        await tx.wait();

        console.log(`Minted ${amountTokens} tokens to ${userAddress}`);
        return tx.hash;
    } catch (error) {
        console.error("Error minting tokens:", error);
        throw error;
    }
}
