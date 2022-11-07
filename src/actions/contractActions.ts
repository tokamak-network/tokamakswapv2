import { Contract } from "@ethersproject/contracts";
import { DEPLOYED } from "../constants/index";
import WTONABI from "../services/abis/WTON.json";
import TONABI from "../services/abis/TON.json";
import ERC20 from "../services/abis/ERC20.json";
import QuoterABI from '../services/abis/Quoter.json';
import SwapperProxy from '../services/abis/SwapperProxy.json';
import SwapperV2 from '../services/abis/SwapperV2.json';
import { ethers, BigNumber } from "ethers";
import { convertNumber, convertFromRayToWei } from "../utils/number";
// import { getConfig } from "../../config.js";
import { padLeft } from "web3-utils";
import store from "../store";
import { setTxPending } from "../store/tx.reducer";
import { toastWithReceipt } from "../utils/toast";
import { openToast } from "../store/app/toast.reducer";
import { getSigner, getProviderOrSigner } from "../utils/contract";

const { TON_ADDRESS, WTON_ADDRESS, SwapProxy, SwapperV2Logic, SwapperV2Proxy, Quoter_ADDRESS, AURA_ADDRESS, LYDA_ADDRESS, DOC_ADDRESS, TOS_ADDRESS, WETH_ADDRESS } = DEPLOYED;

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const FeeAmount = {
  LOW: 500,
  MEDIUM: 3000,
  HIGH: 10000,
};
const FEE_SIZE = 3;
const encodePath = (path: any, fees: any) => {
  if (path.length != fees.length + 1) {
    throw new Error("path/fee lengths do not match");
  }
  let encoded = "0x";
  for (let i = 0; i < fees.length; i++) {
    encoded += path[i].slice(2);
    encoded += fees[i].toString(16).padStart(2 * FEE_SIZE, "0");
  }
  encoded += path[path.length - 1].slice(2);
  return encoded.toLowerCase();
};

const getParams = (address0: string, address1: string) => {

  const wtonTos = [WTON_ADDRESS.toLowerCase(), TOS_ADDRESS.toLowerCase()];
  const auraTos = [AURA_ADDRESS.toLowerCase(), TOS_ADDRESS.toLowerCase()]
  const docTos = [DOC_ADDRESS.toLowerCase(), TOS_ADDRESS.toLowerCase()]
  const lydaTos = [LYDA_ADDRESS.toLowerCase(), TOS_ADDRESS.toLowerCase()]
  const ethTos = [ZERO_ADDRESS, TOS_ADDRESS.toLowerCase()]
  const pool = [address0.toLowerCase(), address1.toLowerCase()]


  getPool(wtonTos, pool)
  switch (true) {
    case getPool(wtonTos, pool):
      return {
        path: encodePath(wtonTos, [FeeAmount.MEDIUM]),
        wrapEth: false,
        inputWrapWTON: false,
        outputUnwrapTON: false,
        fee:FeeAmount.MEDIUM,
      }
    case getPool(auraTos, pool):
      return {
        path: encodePath(auraTos, [FeeAmount.MEDIUM]),
        wrapEth: false,
        inputWrapWTON: false,
        outputUnwrapTON: false,
        outputUnwrapEth:false,
        fee:FeeAmount.MEDIUM,
      }
    case getPool(docTos, pool):
      return {
        path: encodePath(docTos, [FeeAmount.MEDIUM]),
        wrapEth: false,
        inputWrapWTON: false,
        outputUnwrapTON: false,
        outputUnwrapEth:false,
        fee:FeeAmount.MEDIUM,
      }
    case getPool(lydaTos, pool):
      return{
        path: encodePath(docTos, [FeeAmount.MEDIUM]),
        wrapEth: false,
        inputWrapWTON: false,
        outputUnwrapTON: false,
        outputUnwrapEth:false,
        fee:FeeAmount.MEDIUM,
      }
      case getPool(ethTos, pool) :
        return {
          path: encodePath(ethTos, [FeeAmount.MEDIUM]),
          wrapEth: false,
          inputWrapWTON: false,
          outputUnwrapTON: false,
          outputUnwrapEth:false,
          fee:FeeAmount.MEDIUM,
        }
   
  }
}


const getPool = (array1: string[], array2: string[]) => {
  const array2Sorted = array2.slice().sort();
  const equal = array1.length === array2.length && array1.slice().sort().every(function (value, index) {
    return value === array2Sorted[index];
  });

  return equal

}
export const getUserTokenBalance = async (account: string, library: any, tokenAddress: string) => {

  if (tokenAddress.toLowerCase() === WTON_ADDRESS.toLowerCase()) {
    const contract = new Contract(WTON_ADDRESS, WTONABI.abi, library);
    const contractUserBalance = await contract.balanceOf(account);
    const convertedRes = convertNumber({
      amount: contractUserBalance,
      type: "ray",
    });
    return convertedRes;
  }

  else if (tokenAddress === ZERO_ADDRESS) {
    const ethBalance = await library.getBalance(account)
    const balance = convertNumber({
      amount: String(ethBalance),

    });
    return balance;
  }
  else {
    const contract = new Contract(tokenAddress, ERC20.abi, library);
    const contractUserBalance = await contract.balanceOf(account);
    const balance = convertNumber({
      amount: String(contractUserBalance),

    });
    return balance;
  }
}


export const approve = async (account: any, library: any, tokenAddress: string, amount: string, setAllowed: any) => {
  if (library && account) {
    const signer = getSigner(library, account);
    let convertedAmount;
    let contract;
    if (ethers.utils.getAddress(tokenAddress) === ethers.utils.getAddress(WTON_ADDRESS)) {
      const rayAllocated = ethers.utils.parseUnits(amount, '27');
      const contractCreated = new Contract(tokenAddress, WTONABI.abi, library);
      convertedAmount = rayAllocated;
      contract = contractCreated
    }
    else {
      const weiAllocated = ethers.utils.parseEther(amount);
      const contractCreated = new Contract(tokenAddress, TONABI.abi, library);
      convertedAmount = weiAllocated;
      contract = contractCreated
    }

    try {
      const receipt = await contract
        .connect(signer)
        .approve(SwapperV2Proxy, convertedAmount);
      store.dispatch(setTxPending({ tx: true }));

      if (receipt) {
        toastWithReceipt(receipt, setTxPending, 'Swapper');
        await receipt.wait();
        checkApproved(library, account, setAllowed, tokenAddress);
      }
    } catch (err) {
      store.dispatch(setTxPending({ tx: false }));
      store.dispatch(
        //@ts-ignore
        openToast({
          payload: {
            status: 'error',
            title: 'Tx fail to send',
            description: `something went wrong`,
            duration: 5000,
            isClosable: true,
          },
        }),
      );
    }
  }
}

export const checkApproved = async (library: any, userAddress: string | null | undefined, setAllowed: any, tokenAddress: string) => {
  if (userAddress === null || userAddress === undefined || library === undefined || tokenAddress === '') {
    return;
  }
  const signer = getSigner(library, userAddress);

  if (ethers.utils.getAddress(tokenAddress) === ethers.utils.getAddress(WTON_ADDRESS)) {
    const contractCreated = new Contract(tokenAddress, WTONABI.abi, library);
    const allowAmount = await contractCreated
      .connect(signer)
      .allowance(userAddress, SwapperV2Proxy);
    const formatted = Number(ethers.utils.formatUnits(allowAmount, 27))
    setAllowed(formatted)
  }
  else {
    const contractCreated = new Contract(tokenAddress, TONABI.abi, library);
    const allowAmount = await contractCreated
      .connect(signer)
      .allowance(userAddress, SwapperV2Proxy);
    const formatted = Number(ethers.utils.formatEther(allowAmount))
    setAllowed(formatted)

  }
}

export const swapExactInputSingle = async (library: any, userAddress: string | null | undefined, address0: string, address1: string, amount:string) => {
  const params = getParams(address0, address1);
  const amountIn = ethers.utils.parseEther(amount);
  console.log(amountIn);
  
  if (library && userAddress && params) {
    const quoteContract = new Contract(Quoter_ADDRESS, QuoterABI.abi, library);
    const signer = getSigner(library, userAddress);
    const swapperV2 = new Contract(SwapperV2Proxy, SwapperV2.abi, library);
    const amountOut = await quoteContract.callStatic.quoteExactInputSingle(address0,address1, params.fee,amountIn,0 )
    console.log('amountOut',amountOut);
    
    const getExactInputParams = {
      recipient: userAddress,
      path: params?.path,
      amountIn: amountIn,
      amountOutMinimum: amountOut,
      deadline:0
    }
    const tx = await swapperV2.connect(signer).exactInput(getExactInputParams, params.wrapEth, params.outputUnwrapEth,params.inputWrapWTON, params.outputUnwrapTON);
   
  }

}

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
