// import * as dotenv from "dotenv";
// // dotenv.config({path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : `.env.testnet`});
// dotenv.config({ path: `.env` });
import dotenv from "dotenv";
dotenv.config({ path: `.env` });

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-web3";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

require("./scripts/deploy.ts");
require("./scripts/mint.ts");
require("./scripts/tokenUri.ts");
require("./scripts/investments.ts");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

const HARDHAT_NETWORK_CONFIG = {
    chainId: 1337,
    // forking: {
    //   url: process.env.MAINNET_URL || '',
    //   blockNumber: 16501064,
    // },
    // allowUnlimitedContractSize: true,
};

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
    solidity: {
        compilers: [{ version: "0.8.1" }, { version: "0.8.17" }],
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000,
            },
        },
    },
    networks: {
        goerli: {
            url: process.env.GOERLI_URL || "",
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        },
        localhost: {
            ...HARDHAT_NETWORK_CONFIG,
        },
        hardhat: HARDHAT_NETWORK_CONFIG,
        mainnet: {
            url: process.env.MAINNET_URL || "",
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
            chainId: 1,
        },
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        coinmarketcap: process.env.COINMARKETCAP_API_KEY,
        currency: "USD",
        gasPrice: 20,
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    typechain: {
        target: "web3-v1",
    },
    mocha: {
        timeout: 200000,
    },
};

export default config;
