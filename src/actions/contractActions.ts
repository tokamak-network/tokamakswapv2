import { Contract } from "@ethersproject/contracts";
import { getSigner } from "../utils/contract";
import { DEPLOYED } from "../constants/index";
import WTONABI from "../services/abis/WTON.json";
import TONABI from "../services/abis/TON.json";
import ERC20 from "../services/abis/ERC20.json";
import { ethers, BigNumber } from "ethers";
import { convertNumber, convertFromRayToWei } from "../utils/number";
// import { getConfig } from "../../config.js";
import { padLeft } from "web3-utils";
import store from "../store";
import { setTxPending } from "../store/tx.reducer";
import { toastWithReceipt } from "../utils/toast";
import { openToast } from "../store/app/toast.reducer";

const { TON_ADDRESS, WTON_ADDRESS, SwapProxy } = DEPLOYED;

export const getUserTonBalance = async ({
  account,
  library,
  localeString,
}: any) => {
  const contract = new Contract(TON_ADDRESS, ERC20.abi, library);
  const contractUserBalance = await contract.balanceOf(account);
  const balance = convertNumber({
    amount: String(contractUserBalance),
    localeString: localeString || false,
  });
  return balance;
};

export const getUserWtonBalance = async ({
  account,
  library,
  localeString,
}: any) => {
  const contract = new Contract(WTON_ADDRESS, WTONABI.abi, library);
  const contractUserBalance = await contract.balanceOf(account);
  const convertedRes = convertNumber({
    amount: contractUserBalance,
    type: "ray",
  });
  return convertedRes;
};

export const swapWtonToTon = async ({ account, library, amount }: any) => {
  if (library && account) {
    const signer = getSigner(library, account);
    const contract = new Contract(WTON_ADDRESS, WTONABI.abi, library);
    try {
      const receipt = await contract.connect(signer).swapToTON(amount);
      store.dispatch(setTxPending({ tx: true }));
      if (receipt) {
        toastWithReceipt(receipt, setTxPending, "Swapper");
      }
    } catch (err) {
      store.dispatch(setTxPending({ tx: false }));
      store.dispatch(
        //@ts-ignore
        openToast({
          payload: {
            status: "error",
            title: "Tx fail to send",
            description: `something went wrong`,
            duration: 5000,
            isClosable: true,
          },
        })
      );
    }
  }
};

export const swapTonToWton = async ({ account, library, amount }: any) => {
  if (library && account) {
    const signer = getSigner(library, account);
    const contract = new Contract(TON_ADDRESS, TONABI.abi, library);
    const data = getData();
    try {
      const receipt = await contract
        .connect(signer)
        .approveAndCall(WTON_ADDRESS.toLowerCase(), amount, data);
      store.dispatch(setTxPending({ tx: true }));
      if (receipt) {
        toastWithReceipt(receipt, setTxPending, "Swapper");
      }
    } catch (err) {
      store.dispatch(setTxPending({ tx: false }));
      store.dispatch(
        //@ts-ignore
        openToast({
          payload: {
            status: "error",
            title: "Tx fail to send",
            description: `something went wrong`,
            duration: 5000,
            isClosable: true,
          },
        })
      );
    }
  }
};

const marshalString = (str: string) => {
  if (str.slice(0, 2) === "0x") return str;
  return "0x".concat(str);
};

const unmarshalString = (str: string) => {
  if (str.slice(0, 2) === "0x") return str.slice(2);
  return str;
};

const getData = () => {
  const data = marshalString(
    [SwapProxy, "0"]
      .map(unmarshalString)
      .map((str) => padLeft(str, 64))
      .join("")
  );
  return data;
};
