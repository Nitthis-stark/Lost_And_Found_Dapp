async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with deployer:", deployer.address);

    // Deploy FindToken
    const Token = await ethers.getContractFactory("FindToken");
    const token = await Token.deploy();
    await token.deployed(); // wait for deployment
    console.log("FindToken deployed at:", token.target); // Hardhat 3.x

    // Deploy Transaction contract, passing token address
    const TxContract = await ethers.getContractFactory("TokenTransaction");
    const txContract = await TxContract.deploy(token.target);
    await txContract.deployed();
    console.log("Transaction contract deployed at:", txContract.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
