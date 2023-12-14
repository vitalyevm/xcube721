import { getContract } from "./helpers";
import { task } from "hardhat/config";

task("set-base-token-uri", "Sets the base token URI for the deployed smart contract")
    .addParam("uri", "ipfs uri")
    .addParam("address", "Contract Address")
    .setAction(async function (taskArguments, hre) {
        const address = taskArguments.address;
        const networkUrl = hre.network.config.url;
        const contract = await getContract("XCube", address, networkUrl);
        const transactionResponse = await contract.setBaseTokenURI(taskArguments.uri, {
            gasLimit: 500_000,
        });
        console.log(`Transaction Hash: ${transactionResponse.hash}`);
    });

task("set-token-uri", "Sets the base token URI for the deployed smart contract")
    .addParam("token", "")
    .addParam("uri", "")
    .addParam("address", "Contract Address")
    .setAction(async function (taskArguments, hre) {
        const address = taskArguments.address;
        const networkUrl = hre.network.config.url;
        const contract = await getContract("XCube", address, networkUrl);
        const transactionResponse = await contract.setTokenURI(Number.parseInt(taskArguments.token), taskArguments.uri, {
            gasLimit: 500_000,
        });
        console.log(`Transaction Hash: ${transactionResponse.hash}`);
    });

task("token-uri", "Fetches the token metadata for the given token ID")
    .addParam("token", "The tokenID to fetch metadata for")
    .addParam("address", "Contract Address")
    .setAction(async function (taskArguments, hre) {
        const address = taskArguments.address;
        const networkUrl = hre.network.config.url;
        const contract = await getContract("XCube", address, networkUrl);
        const response = await contract.tokenURI(taskArguments.token, {
            gasLimit: 500_000,
        });

        const metadata_url = response;
        console.log(`Metadata URL: ${metadata_url}`);
    });

task("get-token-uris", "Fetches the token metadata for the given token ID")
    .addParam("tokens", "The tokenIDs")
    .addParam("address", "Contract Address")
    .setAction(async function (taskArguments, hre) {
        const address = taskArguments.address;
        const networkUrl = hre.network.config.url;
        const contract = await getContract("XCube", address, networkUrl);
        const tokenArray = JSON.parse(taskArguments.tokens);
        console.log(tokenArray);
        const response = await contract.getTokensURI([1, 2], {
            gasLimit: 500_000,
        });

        const result = response;
        console.log(`Metadata URL: ${result}`);
    });

task("owner-tokens", "Fetches the owner tokens")
    .addParam("address", "Owner address")
    .setAction(async function (taskArguments, hre) {
        const address = taskArguments.address;
        const networkUrl = hre.network.config.url;
        const contract = await getContract("XCube", address, networkUrl);
        const response = await contract.tokensOfOwner(taskArguments.address, {
            gasLimit: 500_000,
        });

        const ownerTokens = response;
        console.log(`Tokens: ${ownerTokens}`);
    });
