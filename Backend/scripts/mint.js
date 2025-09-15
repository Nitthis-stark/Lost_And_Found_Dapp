import { ethers } from "hardhat";

export async function mintTokens(userAddress, amountTokens) {
    const [deployer] = await ethers.getSigners();

    const tokenAddress = process.env.TOKEN_CONTRACT_ADDRESS;
    const Token = await ethers.getContractFactory("FindToken");
    const token = Token.attach(tokenAddress);

    const amount = ethers.parseUnits(amountTokens.toString(), 18);
    const tx = await token.mint(userAddress, amount);
    await tx.wait();

    console.log(`Minted ${amountTokens} tokens to ${userAddress}`);
    return tx.hash; // Optional: return transaction hash
}
