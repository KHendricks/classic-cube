import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  MAX_MINT_AMOUNT,
  PRICE,
} from "./config";

require("dotenv").config();
const ALCHEMY_KEY = process.env.REACT_APP_ALCHEMY_KEY_WSS;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(ALCHEMY_KEY);
declare let window: any;

export const connectedContract = new web3.eth.Contract(
  CONTRACT_ABI,
  CONTRACT_ADDRESS
);

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "ERR1",
        address: addressArray[0],
      };
      return obj;
    } catch (err: any) {
      return {
        address: "",
        status: err.message,
      };
    }
  } else {
    return {
      address: "",
      status: "🦊 Metamask not installed",
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "Using wallet: " + addressArray[0],
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err: any) {
      return {
        address: "",
        status: err.message,
      };
    }
  } else {
    return {
      address: "",
      status: "🦊 Metamask not installed",
    };
  }
};

export const mint = async (_to: string, _mintAmount: number) => {
  if (_mintAmount <= 0 || _mintAmount > MAX_MINT_AMOUNT) {
    return {
      success: false,
      status: `Can only mint between 1-${MAX_MINT_AMOUNT}`,
    };
  }

  try {
    const transactionParameters = {
      to: CONTRACT_ADDRESS,
      from: window.ethereum.selectedAddress,
      value: (_mintAmount * (PRICE * 10 ** 18)).toString(16),
      data: connectedContract.methods.mint(_mintAmount).encodeABI(), //make call to NFT smart contract
    };

    //sign the transaction via Metamask
    try {
      const txHash = await window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        })
        .then((data: any) => console.log(data));

      return {
        success: true,
        status: "Success",
        txHash: txHash,
      };
    } catch (error: any) {
      return {
        success: false,
        status: error.message,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      status: error.message,
    };
  }
};

export const getPausedStatus = async () => {
  try {
    const transactionParameters = {
      to: CONTRACT_ADDRESS,
      from: window.ethereum.selectedAddress,
      data: connectedContract.methods.paused().encodeABI(), //make call to NFT smart contract
    };

    try {
      var data: string = await window.ethereum.request({
        method: "eth_call",
        params: [transactionParameters],
      });
      return {
        success: true,
        data: parseInt(data, 16),
        status: "Grabbed the paused status",
      };
    } catch (error: any) {
      return {
        success: false,
        status: error.message,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      status: error.message,
    };
  }
};

export const getTotalSupply = async () => {
  try {
    const transactionParameters = {
      to: CONTRACT_ADDRESS,
      from: window.ethereum.selectedAddress,
      data: connectedContract.methods.totalSupply().encodeABI(), //make call to NFT smart contract
    };

    try {
      var data: string = await window.ethereum.request({
        method: "eth_call",
        params: [transactionParameters],
      });
      return {
        success: true,
        status: "Sucessfully retrieved total supply",
        data: parseInt(data, 16),
      };
    } catch (error: any) {
      return {
        success: false,
        status: error.message,
        data: -1,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      status: error.message,
      data: -1,
    };
  }
};
