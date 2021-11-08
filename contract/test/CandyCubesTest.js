const { expect } = require("chai");
const { ethers } = require("hardhat");
const ETH_PRICE = 0.01;
const WEI_PRICE = ETH_PRICE * 10 ** 18;

describe("Bunny Babies Contract", function () {
  let CandyCubes;
  let candyCubes;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  before(async function () {
    [owner, addr1, addr2, addrs] = await ethers.getSigners();
    CandyCubes = await ethers.getContractFactory("CandyCubes");
  });

  beforeEach(async function () {
    candyCubes = await CandyCubes.deploy(
      "CandyCubes",
      "CUB",
      "Qmcbaw1ijr6hyhsd3XQvJJH7ecSC6jQCn7ezoWNJsCmGXg"
    );
  });

  it("Owner1: Check owner", async () => {
    expect(await candyCubes.owner()).to.equal(owner.address);
  });

  it("Owner2: Check user can not change contract owner", async () => {
    await expect(
      candyCubes.connect(addr1).transferOwnership(addr1.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Withdraw1: Check owner can withdraw", async () => {
    const isPaused = await candyCubes.paused();
    if (isPaused) {
      await candyCubes.flipPauseStatus();
    }

    const currentSupply = await candyCubes.totalSupply();
    await candyCubes.connect(addr1).mint(5, {
      value: (WEI_PRICE * 5).toString(),
    });
    const newCurrentSupply = await candyCubes.totalSupply();
    expect(currentSupply + 5).to.equal(newCurrentSupply);

    const contractBalance = await candyCubes.contractBalance();
    expect(parseInt(contractBalance._hex, 16)).to.gt(0);

    await candyCubes.withdrawAll();

    const newContractBalance = await candyCubes.contractBalance();
    expect(parseInt(newContractBalance._hex, 16)).to.eq(0);
  });

  it("Withdraw2: Check user can not", async () => {
    // Have user mint tokens to increase balance
    const isPaused = await candyCubes.paused();
    if (isPaused) {
      await candyCubes.flipPauseStatus();
    }

    const currentSupply = await candyCubes.totalSupply();
    await candyCubes.connect(addr1).mint(5, {
      value: (WEI_PRICE * 5).toString(),
    });
    const newCurrentSupply = await candyCubes.totalSupply();
    expect(currentSupply + 5).to.equal(newCurrentSupply);

    const contractBalance = await candyCubes.contractBalance();
    expect(parseInt(contractBalance._hex, 16)).to.gt(0);

    await expect(candyCubes.connect(addr1).withdrawAll()).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );

    const newContractBalance = await candyCubes.contractBalance();
    expect(parseInt(newContractBalance._hex, 16)).to.gt(0);
  });

  it("Data1: Confirm NFT Name", async () => {
    expect(await candyCubes.name()).to.equal("CandyCubes");
  });

  it("Data2: Confirm NFT Symbol", async () => {
    expect(await candyCubes.symbol()).to.equal("CUB");
  });

  it("Data3: Confirm Cost is .01 eth", async () => {
    expect(await candyCubes.COST()).to.equal("10000000000000000");
  });

  it("Paused1: Contract should be paused initially", async () => {
    expect(await candyCubes.paused()).to.equal(true);
  });

  it("Paused2: Owner can flip pause state", async () => {
    await candyCubes.flipPauseStatus();
    expect(await candyCubes.paused()).to.equal(false);
  });

  it("Paused3: User can't flip pause state", async () => {
    await expect(
      candyCubes.connect(addr1).flipPauseStatus()
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Mint1: Owner mints while paused", async function () {
    expect(await candyCubes.paused()).to.equal(true);

    const currentSupply = await candyCubes.totalSupply();
    await candyCubes.mint(1);
    const newCurrentSupply = await candyCubes.totalSupply();

    expect(currentSupply + 1).to.equal(newCurrentSupply);
  });

  it("Mint2: User fails to mint while paused", async function () {
    expect(await candyCubes.paused()).to.equal(true);

    const currentSupply = await candyCubes.totalSupply();
    await expect(candyCubes.connect(addr1).mint(1)).to.be.revertedWith(
      "Contract is paused"
    );
    const newCurrentSupply = await candyCubes.totalSupply();
    expect(currentSupply).to.equal(newCurrentSupply);
  });

  it("Mint3: User mints under 20 (correct price)", async function () {
    const isPaused = await candyCubes.paused();
    if (isPaused) {
      await candyCubes.flipPauseStatus();
    }

    const currentSupply = await candyCubes.totalSupply();
    await candyCubes.connect(addr1).mint(5, {
      value: (WEI_PRICE * 5).toString(),
    });
    const newCurrentSupply = await candyCubes.totalSupply();
    expect(currentSupply + 5).to.equal(newCurrentSupply);
  });

  it("Mint4: User mints over 20 (correct price)", async function () {
    const isPaused = await candyCubes.paused();
    if (isPaused) {
      await candyCubes.flipPauseStatus();
    }

    const currentSupply = await candyCubes.totalSupply();
    await expect(
      candyCubes.connect(addr1).mint(25, {
        value: (WEI_PRICE * 25).toString(),
      })
    ).to.be.revertedWith("Exceeds mint limit");
    const newCurrentSupply = await candyCubes.totalSupply();
    expect(currentSupply).to.equal(newCurrentSupply);
  });

  it("Mint5: User mints exactly 20 (correct price)", async function () {
    const isPaused = await candyCubes.paused();
    if (isPaused) {
      await candyCubes.flipPauseStatus();
    }

    const currentSupply = await candyCubes.totalSupply();
    await candyCubes.connect(addr1).mint(20, {
      value: (WEI_PRICE * 20).toString(),
    });
    const newCurrentSupply = await candyCubes.totalSupply();
    expect(currentSupply + 20).to.equal(newCurrentSupply);
  });

  it("Mint6: User mints under 20 (wrong price)", async function () {
    const isPaused = await candyCubes.paused();
    if (isPaused) {
      await candyCubes.flipPauseStatus();
    }

    const currentSupply = await candyCubes.totalSupply();
    await expect(
      candyCubes.connect(addr1).mint(10, {
        value: (WEI_PRICE * 5).toString(),
      })
    ).to.be.revertedWith("Ethereum cost invalid");

    const newCurrentSupply = await candyCubes.totalSupply();
    expect(currentSupply).to.equal(newCurrentSupply);
  });

  it("Mint7: User mints over 20 (wrong price)", async function () {
    const isPaused = await candyCubes.paused();
    if (isPaused) {
      await candyCubes.flipPauseStatus();
    }

    const currentSupply = await candyCubes.totalSupply();
    await expect(
      candyCubes.connect(addr1).mint(25, {
        value: (WEI_PRICE * 10).toString(),
      })
    ).to.be.revertedWith("Exceeds mint limit");
    const newCurrentSupply = await candyCubes.totalSupply();
    expect(currentSupply).to.equal(newCurrentSupply);
  });

  it("Mint8: User mints exactly 20 (wrong price)", async function () {
    const isPaused = await candyCubes.paused();
    if (isPaused) {
      await candyCubes.flipPauseStatus();
    }

    const currentSupply = await candyCubes.totalSupply();
    await expect(
      candyCubes.connect(addr1).mint(20, {
        value: (WEI_PRICE * 10).toString(),
      })
    ).to.be.revertedWith("Ethereum cost invalid");
    const newCurrentSupply = await candyCubes.totalSupply();
    expect(currentSupply).to.equal(newCurrentSupply);
  });

  it("Mint9: User mints exactly 20 (no price)", async function () {
    const isPaused = await candyCubes.paused();
    if (isPaused) {
      await candyCubes.flipPauseStatus();
    }

    const currentSupply = await candyCubes.totalSupply();
    await expect(candyCubes.connect(addr1).mint(20)).to.be.revertedWith(
      "Ethereum cost invalid"
    );
    const newCurrentSupply = await candyCubes.totalSupply();
    expect(currentSupply).to.equal(newCurrentSupply);
  });

  it("Mint10: Owner mints over 20 ", async function () {
    const currentSupply = await candyCubes.totalSupply();
    await candyCubes.mint(50);
    const newCurrentSupply = await candyCubes.totalSupply();
    expect(currentSupply + 50).to.equal(newCurrentSupply);
  });

  it("Approve1: User can't approve token owned by another ", async function () {
    const isPaused = await candyCubes.paused();
    if (isPaused) {
      await candyCubes.flipPauseStatus();
    }

    const currentSupply = await candyCubes.totalSupply();
    await candyCubes.mint(20);
    const newCurrentSupply = await candyCubes.totalSupply();
    expect(currentSupply + 20).to.equal(newCurrentSupply);

    await expect(
      candyCubes.connect(addr1).approve(addr1.address, 0)
    ).to.revertedWith(
      "ERC721: approve caller is not owner nor approved for all"
    );
  });

  it("Approve2: User can't approve all owned by another ", async function () {
    const isPaused = await candyCubes.paused();
    if (isPaused) {
      await candyCubes.flipPauseStatus();
    }

    const currentSupply = await candyCubes.totalSupply();
    await candyCubes.mint(20);
    const newCurrentSupply = await candyCubes.totalSupply();
    expect(currentSupply + 20).to.equal(newCurrentSupply);

    await expect(
      candyCubes.connect(addr1).setApprovalForAll(addr1.address, true)
    ).to.revertedWith("ERC721: approve to caller");
  });

  it("Transfer1: User can't transfer tokens owned by another ", async function () {
    const isPaused = await candyCubes.paused();
    if (isPaused) {
      await candyCubes.flipPauseStatus();
    }

    const currentSupply = await candyCubes.totalSupply();
    await candyCubes.mint(20);
    const newCurrentSupply = await candyCubes.totalSupply();
    expect(currentSupply + 20).to.equal(newCurrentSupply);

    await expect(
      candyCubes.connect(addr1).transferFrom(owner.address, addr1.address, 0)
    ).to.revertedWith("ERC721: transfer caller is not owner nor approved");
  });

  it("Edge1: Tokens sold out", async function () {
    const isPaused = await candyCubes.paused();
    if (isPaused) {
      await candyCubes.flipPauseStatus();
    }

    for (let i = 0; i < 777; i++) {
      await candyCubes.connect(addr1).mint(1, {
        value: (WEI_PRICE * 1).toString(),
      });
    }

    const maxSupply = await candyCubes.MAX_SUPPLY();
    const totalSupply = await candyCubes.totalSupply();
    expect(maxSupply).to.equal(totalSupply);
  }).timeout(100000);

  it("Edge2: Tokens sold out and user attempts to mint one afterwards", async function () {
    const isPaused = await candyCubes.paused();
    if (isPaused) {
      await candyCubes.flipPauseStatus();
    }

    for (let i = 0; i < 777; i++) {
      await candyCubes.connect(addr1).mint(1, {
        value: (WEI_PRICE * 1).toString(),
      });
    }

    await expect(
      candyCubes.connect(addr1).mint(12, {
        value: (WEI_PRICE * 12).toString(),
      })
    ).to.be.revertedWith("Not enough tokens remaining");

    const maxSupply = await candyCubes.MAX_SUPPLY();
    const totalSupply = await candyCubes.totalSupply();
    expect(maxSupply).to.equal(totalSupply);

    await expect(
      candyCubes.connect(addr1).mint(1, {
        value: (WEI_PRICE * 1).toString(),
      })
    ).to.be.revertedWith("Not enough tokens remaining");
  }).timeout(100000);

  it("Edge3: Tokens almost sold out and user attempts to mint more than available", async function () {
    const isPaused = await candyCubes.paused();
    if (isPaused) {
      await candyCubes.flipPauseStatus();
    }

    for (let i = 0; i < 775; i++) {
      await candyCubes.connect(addr1).mint(1, {
        value: (WEI_PRICE * 1).toString(),
      });
    }

    await expect(
      candyCubes.connect(addr1).mint(20, {
        value: (WEI_PRICE * 20).toString(),
      })
    ).to.be.revertedWith("Not enough tokens remaining");

    const maxSupply = await candyCubes.MAX_SUPPLY();
    const totalSupply = await candyCubes.totalSupply();
    expect(maxSupply).to.gt(totalSupply);
  }).timeout(100000);
});
