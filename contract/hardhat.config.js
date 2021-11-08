/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");

const {
  DEV_ALCHEMY_API_KEY,
  DEV_PRIVATE_KEY,
  PROD_ALCHEMY_API_KEY,
  PROD_PRIVATE_KEY,
  ETHERSCAN_API_KEY,
} = process.env;

module.exports = {
  solidity: "0.8.7",
  networks: {
    hardhat: {},
    rinkeby: {
      url: DEV_ALCHEMY_API_KEY,
      accounts: [`0x${DEV_PRIVATE_KEY}`],
    },
    main: {
      url: PROD_ALCHEMY_API_KEY,
      accounts: [`0x${DEV_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
