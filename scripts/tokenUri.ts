import { ethers } from "ethers";
import { getContract } from "./helpers";
import INVESTMENTS_ABI from "../artifacts/contracts/Investments.sol/Investments.json";
import { task } from "hardhat/config";

// npx hardhat set-base-token-uri --network goerli --uri ipfs://Qmdm3n6xPfAi4f6UENQuqSYco411G7wXVPt43Q9RYwzzT4/ --address 0x1fd4f9d5d9c429ab87f40f6436d958f8fc8051b5
// npx hardhat set-base-token-uri --network mainnet --uri ipfs://Qmdm3n6xPfAi4f6UENQuqSYco411G7wXVPt43Q9RYwzzT4/ --address 0x8683a3e90c0409B0f6426A5925a73D38dcc04e54
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

// npx hardhat set-token-uri --network goerli --address 0x1fd4f9d5d9c429ab87f40f6436d958f8fc8051b5 --token 1 --uri ipfs://yandex/
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

// npx hardhat token-uri --network goerli --address 0x1fd4f9d5d9c429ab87f40f6436d958f8fc8051b5 --token 1
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

        // const metadata = await fetch(metadata_url).then(res => res.json());
        // console.log(`Metadata fetch response: ${JSON.stringify(metadata, null, 2)}`);
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

        // const metadata = await fetch(metadata_url).then(res => res.json());
        // console.log(`Metadata fetch response: ${JSON.stringify(metadata, null, 2)}`);
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

        // const metadata = await fetch(metadata_url).then(res => res.json());
        // console.log(`Metadata fetch response: ${JSON.stringify(metadata, null, 2)}`);
    });


// npx hardhat deploy --network goerli

// 0xa6655e764efFf4a5f6683a7E6CC4a514425FDc65