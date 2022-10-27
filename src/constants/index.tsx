import { injected,trazorConnector } from "../connectors/index";
import { WalletInfo } from "../types/index";
import { DEPLOYED_TYPE } from "./type";
import { ethers } from "ethers";

export const REACT_APP_MODE = process.env.REACT_APP_MODE as string;
export const DEFAULT_NETWORK = REACT_APP_MODE === "DEV" ? 5 : 1;
export const BASE_PROVIDER =
  REACT_APP_MODE === "DEV"
    ? ethers.getDefaultProvider("goerli")
    : ethers.getDefaultProvider("mainnet");
export const NetworkContextName = `${new Date().getTime()}-NETWORK`;

const MAINNET_DEPLOYED = {
  TON_ADDRESS: "0x2be5e8c109e2197D077D13A82dAead6a9b3433C5",
  TOS_ADDRESS: "0x409c4D8cd5d2924b9bc5509230d16a61289c8153",
  LockTOS_ADDRESS: "0x69b4A202Fa4039B42ab23ADB725aA7b1e9EEBD79",
  WTON_ADDRESS: "0xc4A11aaf6ea915Ed7Ac194161d2fC9384F15bff2",
  SwapProxy: "0x30e65B3A6e6868F044944Aa0e9C5d52F8dcb138d",
};

const RINKEBY_DEPLOYED = {
  TON_ADDRESS: "0x44d4F5d89E9296337b8c48a332B3b2fb2C190CD0",
  TOS_ADDRESS: "0x73a54e5C054aA64C1AE7373C2B5474d8AFEa08bd",
  LockTOS_ADDRESS: "0x5adc7de3a0B4A4797f02C3E99265cd7391437568",
  WTON_ADDRESS: "0x709bef48982Bbfd6F2D4Be24660832665F53406C",
  SwapProxy: "0x8032d21F59CDB42C9c94a3A41524D4CCF0Cae96c",
};

const GOERLI_DEPLOYED = {
  TON_ADDRESS: "0x68c1F9620aeC7F2913430aD6daC1bb16D8444F00",
  TOS_ADDRESS: "0x67F3bE272b1913602B191B3A68F7C238A2D81Bb9",
  LockTOS_ADDRESS: "0x63689448AbEaaDb57342D9e0E9B5535894C35433",
  WTON_ADDRESS: "0xe86fCf5213C785AcF9a8BFfEeDEfA9a2199f7Da6",
  SwapProxy: "0xB79DcFE624D0A69c5c2a206a99F240f1d2Ca1D80",
};

export const DEPLOYED: DEPLOYED_TYPE =
  REACT_APP_MODE === "PRODUCTION" ? MAINNET_DEPLOYED : GOERLI_DEPLOYED;

  export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
    INJECTED: {
      connector: injected,
      name: "Injected",
      iconName: "metamask.svg",
      description: "Injected web3 provider.",
      href: null,
      color: "#010101",
      primary: true,
      type: "INJECTED",
    },
    METAMASK: {
      connector: injected,
      name: "MetaMask",
      iconName: "metamask.svg",
      description: "Easy-to-use browser extension.",
      href: null,
      color: "#E8831D",
      type: "METAMASK",
    },
    TREZOR: {
      connector: trazorConnector,
      name: "Trezor",
      iconName: "trezor.png",
      description: "Hardware Wallet.",
      href: null,
      color: "#E8831D",
      type: "TREZOR",
    },
  };
  