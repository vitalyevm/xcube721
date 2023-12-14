import { ethers } from "ethers";
import { getContract } from "./helpers";
import { task } from "hardhat/config";

task("pre-mint", "Mints from the XCube contract")
    .addParam("address", "The address to receive a token")
    .setAction(async function (taskArguments, hre) {
        const networkUrl = hre.network.config.url;
        const address = taskArguments.address;

        const contract = await getContract("XCube", address, networkUrl);
        const tx = await contract.flipSaleState();
        console.log(`Transaction Hash: ${tx.hash}`);
    });

task("mint", "Mints from the XCube contract")
    .addParam("address", "The address to receive a token")
    .addParam("numtokens", "The number of tokens to mint")
    .setAction(async function (taskArguments, hre) {
        const networkUrl = hre.network.config.url;
        const address = taskArguments.address;
        const numTokens = taskArguments.numtokens;

        if (numTokens <= 0 || numTokens > 20) {
            console.error("Invalid number of tokens. Can only mint between 1 and 20 tokens at a time.");
            return;
        }

        const contract = await getContract("XCube", address, networkUrl);
        const mintPrice = ethers.utils.parseEther("0.00001");
        const totalMintCost = mintPrice.mul(numTokens);
        const gasPrice = ethers.utils.parseUnits("23", "gwei");
        const transactionResponse = await contract.mintCubes(numTokens, {
            value: 0,
            gasPrice: gasPrice,
            gasLimit: 1_500_000,
        });
        console.log(`Transaction Hash: ${transactionResponse.hash}`);
    });

task("withdraw", "Withdraws funds from the XCube contract")
    .addParam("contractaddress", "The address to withdraw to")
    .addParam("owneraddress", "The address to withdraw to")
    .setAction(async function (taskArguments, hre) {
        const networkUrl = hre.network.config.url;
        const contractAddress = taskArguments.contractaddress;
        const ownerAddress = taskArguments.owneraddress;

        const contract = await getContract("XCube", contractAddress, networkUrl);

        const tx = await contract.withdrawPayments(ownerAddress);
        console.log(`Withdrawal Transaction Hash: ${tx.hash}`);
    });

