import { getAccount } from "./helpers";
import { task } from "hardhat/config";

task("check-balance", "Prints out the balance of your account").setAction(async function (taskArguments, hre) {
    const networkUrl = hre.network.config.url;
    const account = getAccount(networkUrl);
    console.log(`Account balance for ${account.address}: ${await account.getBalance()}`);
});

task("deploy", "Deploys the XCube.sol contract").setAction(async function (taskArguments, hre) {
    const networkUrl = hre.network.config.url;
    const account = getAccount(networkUrl);
    const nftContractFactory = await hre.ethers.getContractFactory("XCube", account);
    const gasLimit = 5000000;

    const gasPrice = ethers.utils.parseUnits("23", "gwei");

    const nft = await nftContractFactory.deploy("XCube", "XCC", {
        gasLimit: gasLimit,
        gasPrice: gasPrice,
    });
    console.log(`Contract deployed to address: ${nft.address}`);
});

