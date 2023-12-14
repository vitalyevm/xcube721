const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("XCube Contract", function () {
    let XCube;
    let xCube;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {
        XCube = await ethers.getContractFactory("XCube");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        xCube = await XCube.deploy("XCube", "XCC");
        await xCube.deployed();
    });

    describe("Minting", function () {
        beforeEach(async function () {
            await xCube.connect(owner).flipSaleState();
        });

        it("Should mint new tokens", async function () {
            const numberOfTokens = 5;
            const totalMintCost = ethers.utils.parseEther((0.06 * numberOfTokens).toString());
            const mintTx = await xCube.connect(addr1).mintCubes(numberOfTokens, { value: totalMintCost });

            expect(await xCube.totalSupply()).to.equal(numberOfTokens);
        });

        it("Should mint 10 tokens and check tokensOfOwner function", async function () {
            const numberOfTokens = 10;
            const totalMintCost = ethers.utils.parseEther((0.06 * numberOfTokens).toString());
            await xCube.connect(addr1).mintCubes(numberOfTokens, { value: totalMintCost });

            // Verify that the total supply has increased correctly
            expect(await xCube.totalSupply()).to.equal(numberOfTokens);

            // Check tokensOfOwner for addr1
            const ownedTokens = await xCube.tokensOfOwner(addr1.address);
            expect(ownedTokens.length).to.equal(numberOfTokens);

            // Check if the owned tokens are the first 10 tokens
            for (let i = 0; i < numberOfTokens; i++) {
                expect(ownedTokens[i]).to.equal(i + 1); // Token IDs should start from 1
            }
        });

        it("Should start minting tokens from ID 1", async function () {
            const numberOfTokens = 1;
            const totalMintCost = ethers.utils.parseEther((0.06 * numberOfTokens).toString());
            await xCube.connect(addr1).mintCubes(numberOfTokens, { value: totalMintCost });

            const ownerOfFirstToken = await xCube.ownerOf(1);
            expect(ownerOfFirstToken).to.equal(addr1.address);

            // Optionally, check that token 0 does not exist
            await expect(xCube.ownerOf(0)).to.be.revertedWith("ERC721: invalid token ID");
        });

        it("Should prevent minting when sale is not active", async function () {
            await xCube.connect(owner).flipSaleState();
            const mintCost = ethers.utils.parseEther("0.06"); // Cost for 1 token
            await expect(xCube.connect(addr1).mintCubes(1, { value: mintCost })).to.be.revertedWith("Sale not active");
        });

        it("Should prevent minting more than the max allowed per transaction", async function () {
            const totalMintCost = ethers.utils.parseEther((0.06 * 21).toString()); // Cost for 21 tokens
            await expect(xCube.connect(addr1).mintCubes(21, { value: totalMintCost })).to.be.revertedWith("Exceeds max token purchase");
        });

        it("Should allow the owner to mint tokens for free", async function () {
            const numberOfTokens = 5;
            const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);

            // Owner mints tokens without sending Ether
            await xCube.connect(owner).mintCubes(numberOfTokens, { value: 0 });

            // Check that the total supply has increased by the correct amount
            expect(await xCube.totalSupply()).to.equal(numberOfTokens);

            // Optionally, check that the owner's Ether balance has not decreased
            const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
            expect(ownerBalanceAfter).to.be.closeTo(ownerBalanceBefore, ethers.utils.parseUnits("0.01", "ether"));
        });
    });

    describe("Base Token URI", function () {
        beforeEach(async function () {
            await xCube.connect(owner).flipSaleState();
            const mintCost = ethers.utils.parseEther("0.06"); // Cost for 1 token
            await xCube.connect(addr1).mintCubes(1, { value: mintCost });
        });
        const newBaseURI = "ipfs://newbaseuri/";

        it("Should allow the owner to set the base token URI", async function () {
            await xCube.connect(owner).setBaseTokenURI(newBaseURI);
            const getUri = await xCube.baseTokenURI();
            console.log("getUri", getUri);
            expect(getUri).to.equal(newBaseURI);
        });

        it("Should prevent non-owners from setting the base token URI", async function () {
            await expect(xCube.connect(addr1).setBaseTokenURI(newBaseURI)).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe("Token URI", function () {
        const newBaseURI = "ipfs://baseuri/";
        const customTokenURI = "ipfs://customuri/1.json";

        beforeEach(async function () {
            await xCube.connect(owner).flipSaleState();
            const mintCost = ethers.utils.parseEther("0.12"); // Cost for 2 tokens
            await xCube.connect(addr1).mintCubes(2, { value: mintCost });

            await xCube.connect(owner).setBaseTokenURI(newBaseURI);
        });

        it("Should allow changing the URI of a specific token", async function () {
            await xCube.connect(owner).setTokenURI(1, customTokenURI);

            expect(await xCube.tokenURI(1)).to.equal(customTokenURI);
            expect(await xCube.tokenURI(2)).to.equal(newBaseURI + "2.json");
        });

        it("Should revert when a non-owner tries to change the token URI", async function () {
            await expect(xCube.connect(addr1).setTokenURI(1, customTokenURI)).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe("BalanceOf Function", function () {
        beforeEach(async function () {
            await xCube.connect(owner).flipSaleState();

            await xCube.connect(addr1).mintCubes(1, { value: ethers.utils.parseEther("0.06") });

            await xCube.connect(addr2).mintCubes(2, { value: ethers.utils.parseEther("0.12") });
        });

        it("Should return the correct number of tokens owned by an address", async function () {
            expect(await xCube.balanceOf(addr1.address)).to.equal(1);

            expect(await xCube.balanceOf(addr2.address)).to.equal(2);

            expect(await xCube.balanceOf(owner.address)).to.equal(0);
        });

        it("Should revert when querying the balance for the zero address", async function () {
            await expect(xCube.balanceOf("0x0000000000000000000000000000000000000000")).to.be.revertedWith(
                "ERC721: address zero is not a valid owner",
            );
        });
    });

    describe("Token Transfer", function () {
        beforeEach(async function () {
            await xCube.connect(owner).flipSaleState();
            const mintCost = ethers.utils.parseEther("0.06"); // Cost for 1 token
            await xCube.connect(owner).mintCubes(1, { value: mintCost });
        });

        it("Should transfer a token from owner to another address", async function () {
            const tokenId = 1;

            expect(await xCube.ownerOf(tokenId)).to.equal(owner.address);

            await xCube.connect(owner)["safeTransferFrom(address,address,uint256)"](owner.address, addr1.address, tokenId);

            expect(await xCube.ownerOf(tokenId)).to.equal(addr1.address);
        });

        it("Should remove the token from the original owner's list after transfer", async function () {
            const tokenId = 1;

            await xCube.connect(owner)["safeTransferFrom(address,address,uint256)"](owner.address, addr1.address, tokenId);

            const ownerTokens = await xCube.tokensOfOwner(owner.address);
            const addr1Tokens = await xCube.tokensOfOwner(addr1.address);

            const ownerTokensArray = ownerTokens.map((token) => token.toNumber());
            const addr1TokensArray = addr1Tokens.map((token) => token.toNumber());

            expect(ownerTokensArray).to.not.include(tokenId);
            expect(addr1TokensArray).to.include(tokenId);
        });

        it("Should revert the transfer if the caller is not the owner", async function () {
            const tokenId = 1;

            await expect(
                xCube.connect(addr1)["safeTransferFrom(address,address,uint256)"](owner.address, addr2.address, tokenId),
            ).to.be.revertedWith("ERC721: caller is not token owner or approved");
        });
    });

    describe("Token Transfer", function () {
        it("Should increase owner's balance after withdrawal when addr2 mints 15 tokens", async function () {
            await xCube.connect(owner).flipSaleState();
            const mintPrice = ethers.utils.parseEther("0.06");
            const totalMintCost = mintPrice.mul(14);
            await xCube.connect(addr2).mintCubes(14, { value: totalMintCost });

            const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
            const tx = await xCube.connect(owner).withdrawPayments(owner.address);
            const receipt = await tx.wait();

            const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

            const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
            const expectedBalanceIncrease = totalMintCost.sub(gasUsed);
            const expectedBalance = ownerBalanceBefore.add(expectedBalanceIncrease);
            expect(ownerBalanceAfter).to.be.closeTo(expectedBalance, ethers.utils.parseUnits("0.01", "ether")); // Allowing a small margin due to varying gas costs
        });
    });
});
