import { ethers } from "ethers";
import XCUBE_ABI from "../artifacts/contracts/XCube.sol/XCube.json";
import INVESTMENTS_ABI from "../artifacts/contracts/Investments.sol/Investments.json";

function getEnvVariable(key, defaultValue?: any) {
    if (process.env[key]) {
        return process.env[key];
    }
    if (!defaultValue) {
        throw `${key} is not defined and no default value was provided`;
    }
    return defaultValue;
}

function getProvider(networkUrl) {
    return new ethers.providers.JsonRpcProvider(networkUrl);
}

export function getAccount(networkUrl) {
    return new ethers.Wallet(getEnvVariable("PRIVATE_KEY"), getProvider(networkUrl));
}

export function getContract(contractName, address, hre) {
    const account = getAccount(hre);
    let contractABI;
    let contractAddress;

    switch (contractName) {
        case "Investments":
            contractABI = INVESTMENTS_ABI.abi;
            contractAddress = address;
            break;
        case "XCube":
            contractABI = XCUBE_ABI.abi;
            contractAddress = address;
            break;
        default:
            throw new Error(`ABI for contract ${contractName} not found`);
    }

    return new ethers.Contract(contractAddress, contractABI, account);
}
