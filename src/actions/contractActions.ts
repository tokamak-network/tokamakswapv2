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
import { getParams } from "../utils/params";

const { TON_ADDRESS, WTON_ADDRESS, SwapProxy, SwapperV2Proxy, Quoter_ADDRESS, WETH_ADDRESS } = DEPLOYED;

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const FEE_SIZE = 3;

const encodePath = (path: any, fees: any) => {
  if (path.length !== fees.length + 1) {
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


export const addToken = async (
  tokenAddress: string,
  library: any,
  tokenImage: string,
) => {

  if (tokenAddress.toLocaleLowerCase() === WTON_ADDRESS.toLocaleLowerCase()) {
    const contract = new Contract(WTON_ADDRESS, WTONABI.abi, library);
    const tokenSymbol = await contract.symbol();
    const tokenDecimals = await contract.decimals();
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      //@ts-ignore
      const wasAdded = await window?.ethereum?.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });
      if (wasAdded) {
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  }

  else {
    const contract = new Contract(tokenAddress, TONABI.abi, library);
    const tokenSymbol = await contract.symbol();
    const tokenDecimals = await contract.decimals();
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      //@ts-ignore
      const wasAdded = await window?.ethereum?.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });
      if (wasAdded) {
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  }
};


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

export const approve = async (account: any, library: any, tokenAddress: string, setAllowed: any) => {
  if (library && account) {
    const signer = getSigner(library, account);
    let convertedAmount;
    let contract;
    if (ethers.utils.getAddress(tokenAddress) === ethers.utils.getAddress(WTON_ADDRESS)) {
      const contractCreated = new Contract(tokenAddress, WTONABI.abi, library);
      contract = contractCreated
    }
    else {
      const contractCreated = new Contract(tokenAddress, TONABI.abi, library);
      contract = contractCreated
    }

    try {
      const totalSupply = await contract.totalSupply();
      const receipt = await contract
        .connect(signer)
        .approve(SwapperV2Proxy, totalSupply);
      store.dispatch(setTxPending({ tx: true, data: { name: 'approve' } }));

      if (receipt) {
        toastWithReceipt(receipt, setTxPending, 'Swapper');
        await receipt.wait();
        checkApproved(library, account, setAllowed, tokenAddress);
      }
    } catch (err) {
      store.dispatch(setTxPending({ tx: false, data: { name: 'approve' } }));
      store.dispatch(
        //@ts-ignore
        openToast({
          payload: {
            status: 'error',
            title: 'Tx failed to send',
            description: `Something went wrong`,
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

const exactInput = async (signer: any, swapperV2: any, exactInputParams: any, wrapEth: boolean, outputUnwrapEth: boolean, inputWrapWTON: boolean, outputUnwrapTON: boolean) => {
  const receipt = await swapperV2.connect(signer).exactInput(exactInputParams, wrapEth, outputUnwrapEth, inputWrapWTON, outputUnwrapTON)
  return receipt
}
const exactInputEth = async (signer: any, swapperV2: any, exactInputParams: any, wrapEth: boolean, outputUnwrapEth: boolean, inputWrapWTON: boolean, outputUnwrapTON: boolean, value: any) => {
  const receipt = await swapperV2.connect(signer).exactInput(exactInputParams, wrapEth, outputUnwrapEth, inputWrapWTON, outputUnwrapTON, value)
  return receipt
}

const exactOutput = async (signer: any, swapperV2: any, exactOutputParams: any, wrapEth: boolean, outputUnwrapEth: boolean, inputWrapWTON: boolean, outputUnwrapTON: boolean) => {
  const receipt = await swapperV2.connect(signer).exactOutput(exactOutputParams, wrapEth, outputUnwrapEth, inputWrapWTON, outputUnwrapTON)
  return receipt
}

const exactOutputEth = async (signer: any, swapperV2: any, exactOutputParams: any, wrapEth: boolean, outputUnwrapEth: boolean, inputWrapWTON: boolean, outputUnwrapTON: boolean, value: any) => {
  const receipt = await swapperV2.connect(signer).exactOutput(exactOutputParams, wrapEth, outputUnwrapEth, inputWrapWTON, outputUnwrapTON, value)
  return receipt
}

//getExpectedOutput function predicts the output the user will get for exact input (swapExactInput)

export const getExpectedOutput = async (library: any, userAddress: string | null | undefined, address0: string, address1: string, amount: string, slippage: string) => {
  //address0 = ton 
  //addres1 = tos  
  let denominator;
  let numerator;
  const int = Number.isInteger(Number(slippage));
  if (slippage !== '' && Number(slippage) > 0 && Number(slippage) < 100) {
    if (int) {
      denominator = BigNumber.from("100")
      const slippageCalc = 100 - Number(slippage)
      numerator = BigNumber.from(slippageCalc.toString());
    }
    else {
      const countDecimals = slippage.split('.')[1].length;
      const denom = 100 * (10 ** countDecimals);
      const slippageCalc = denom - (Number(slippage) * (10 ** countDecimals))
      denominator = BigNumber.from(denom.toString());
      numerator = BigNumber.from(slippageCalc.toString())
    }
  }
  else {
    denominator = BigNumber.from("100")
    numerator = BigNumber.from("99")
  }
  let amountIn

  if (address0.toLowerCase() === WTON_ADDRESS.toLowerCase() || address0.toLowerCase() === TON_ADDRESS.toLowerCase()) {
    const tempAmountIn = ethers.utils.parseUnits(amount, '27');
    const xx = BigNumber.from(1e9.toString())
    amountIn = (tempAmountIn.div(xx)).mul(xx)
  }
  else {
    amountIn = ethers.utils.parseEther(amount)
  }
  const params = getParams(address0, address1);
  //address0 => TOS, address11=>DOC
  if (library && userAddress && params && Number(amount) !== 0) {
    const quoteContract = new Contract(Quoter_ADDRESS, QuoterABI.abi, library);
    const amountOut = await quoteContract.callStatic.quoteExactInput(params.path, amountIn)
    const minimumAmountOut = amountOut.mul(numerator).div(denominator);
    if (address1.toLowerCase() === WTON_ADDRESS.toLowerCase() || params.outputUnwrapTON) {
      const converted = convertNumber({
        amount: minimumAmountOut,
        type: "ray",
      });

      const formatted = converted && converted.indexOf(".") > -1 ? converted?.slice(
        0,
        converted?.indexOf(".") + 3
      ) : converted


      const convertedAmountOut = convertNumber({
        amount: amountOut,
        type: "ray",
      });

      const formattedAmountOut = convertedAmountOut && convertedAmountOut.indexOf(".") > -1 ? convertedAmountOut?.slice(
        0,
        convertedAmountOut?.indexOf(".") + 3
      ) : convertedAmountOut

      return { formatted, minimumAmountOut, amountIn, formattedAmountOut }
    }
    else {
      const converted = ethers.utils.formatEther(minimumAmountOut)
      const formatted = converted && converted.indexOf(".") > -1 ? converted?.slice(
        0,
        converted?.indexOf(".") + 3
      ) : converted
      const convertedAmountOut = ethers.utils.formatEther(amountOut)
      const formattedAmountOut = convertedAmountOut && convertedAmountOut.indexOf(".") > -1 ? convertedAmountOut?.slice(
        0,
        convertedAmountOut?.indexOf(".") + 3
      ) : convertedAmountOut
      return { formatted, minimumAmountOut, amountIn, formattedAmountOut }
    }
  }
  else if (address0.toLowerCase() === WTON_ADDRESS.toLowerCase() && address1.toLowerCase() === TON_ADDRESS.toLowerCase() || address1.toLowerCase() === WTON_ADDRESS.toLowerCase() && address0.toLowerCase() === TON_ADDRESS.toLowerCase()) {
    const formatted = amount;
    const minimumAmountOut = amount;
    const formattedAmountOut = amount
    return { formatted, minimumAmountOut, formattedAmountOut }
  }
}

// exact input tos to doc path is tosDoc
// exact output tos to doc path is 

// getExpectedInput function predicts the input the user will spend for exact output (swapExactOutput)
export const getExpectedInput = async (library: any, userAddress: string | null | undefined, address0: string, address1: string, amount: string, slippage: string) => {
  const params = getParams(address1, address0);
  // address1 bottom output // tos
  //address0 top input  // ton 

  // amount is user input from bottom

  let amountOut
  let denominator;
  let numerator;

  const int = Number.isInteger(Number(slippage));

  if (slippage !== '' && Number(slippage) > 0 && Number(slippage) < 100) {
    if (int) {
      denominator = BigNumber.from("100")
      const slippageCalc = 100 + Number(slippage)
      numerator = BigNumber.from(slippageCalc.toString());
    }
    else {
      const countDecimals = slippage.split('.')[1].length;
      const denom = 100 * (10 ** countDecimals);
      const slippageCalc = denom + (Number(slippage) * (10 ** countDecimals))
      denominator = BigNumber.from(denom.toString());
      numerator = BigNumber.from(slippageCalc.toString())
    }
  }
  else {
    denominator = BigNumber.from("100")
    numerator = BigNumber.from("103")
  }
  //user input amount convert to ray ? when address0 == ton/wton or address1 == ton/wton?


  if (address1.toLowerCase() === WTON_ADDRESS.toLowerCase()) {
    amountOut = ethers.utils.parseUnits(amount, '27');
  }
  else {
    amountOut = ethers.utils.parseEther(amount)
  }
  if (library && userAddress && params && Number(amount) !== 0) {
    const quoteContract = new Contract(Quoter_ADDRESS, QuoterABI.abi, library);
    let amountIn;
    try {
      amountIn = await quoteContract.callStatic.quoteExactOutput(params.path, amountOut); // ray  when address0 is ton/wton // wei if address0 is doc/eth/...     
      const xx = BigNumber.from(1e9.toString())

      const tempAmountIn = amountIn.mul(numerator).div(denominator);

      const maximumAmountIn = address0.toLowerCase() === TON_ADDRESS.toLowerCase() ? (tempAmountIn.div(xx)).mul(xx) : tempAmountIn

      if (address0.toLowerCase() === WTON_ADDRESS.toLowerCase() || address0.toLowerCase() === TON_ADDRESS.toLowerCase() || params.inputWrapWTON) {
        const converted = convertNumber({
          amount: maximumAmountIn,
          type: "ray",
        });

        const formatted = converted && converted.indexOf(".") > -1 ? converted?.slice(
          0,
          converted?.indexOf(".") + 3
        ) : converted

        const convertedAmountOut = convertNumber({
          amount: amountIn,
          type: "ray",
        });

        const formattedAmountOut = convertedAmountOut && convertedAmountOut.indexOf(".") > -1 ? convertedAmountOut?.slice(
          0,
          convertedAmountOut?.indexOf(".") + 3
        ) : convertedAmountOut

        return { maximumAmountIn, amountIn, amountOut, formatted, formattedAmountOut }
      }

      else {
        const converted = ethers.utils.formatEther(maximumAmountIn)
        const formatted = converted && converted.indexOf(".") > -1 ? converted?.slice(
          0,
          converted?.indexOf(".") + 3
        ) : converted
        const convertedAmountOut = ethers.utils.formatEther(amountIn)
        const formattedAmountOut = convertedAmountOut && convertedAmountOut.indexOf(".") > -1 ? convertedAmountOut?.slice(
          0,
          convertedAmountOut?.indexOf(".") + 3
        ) : convertedAmountOut

        return { maximumAmountIn, amountIn, amountOut, formatted, formattedAmountOut }
      }

    }
    catch (err) {
      return { err }
    }

  }

  else if (address0.toLowerCase() === WTON_ADDRESS.toLowerCase() && address1.toLowerCase() === TON_ADDRESS.toLowerCase() || address1.toLowerCase() === WTON_ADDRESS.toLowerCase() && address0.toLowerCase() === TON_ADDRESS.toLowerCase()) {
    const formatted = amount;
    const minimumAmountOut = amount;
    const formattedAmountOut = amount
    return { formatted, minimumAmountOut, formattedAmountOut }
  }
}

export const getExpectedAdvanced = async (library: any, userAddress: string | null | undefined, pools: any, amount: string, slippage: string) => {
  const fees = pools.map((pool: any) => {
    return pool.fee
  })  
  const tempTokenPath = pools.map((pool: any) => {
    // return pool.token0.address
    if (pool.token0.address.toLowerCase() === TON_ADDRESS.toLowerCase()) {
      return WTON_ADDRESS
    }
    else if (pool.token0.address.toLowerCase() === ZERO_ADDRESS.toLowerCase()) {
      return WETH_ADDRESS
    }
    else {
       return pool.token0.address
    }
  })  
  const address1 = pools[pools.length - 1].token1.address
  const address0 = pools[0].token0.address
  const calcToken1 = address1.toLowerCase() === TON_ADDRESS.toLowerCase()? WTON_ADDRESS:address1.toLowerCase() === ZERO_ADDRESS.toLowerCase()?WETH_ADDRESS :address1
  
  tempTokenPath.push(calcToken1)
  const encoded = encodePath(tempTokenPath, fees);  
  let denominator;
  let numerator;
  const int = Number.isInteger(Number(slippage));

  if (slippage !== '' && Number(slippage) > 0 && Number(slippage) < 100) {
    if (int) {
      denominator = BigNumber.from("100")
      const slippageCalc = 100 - Number(slippage)
      numerator = BigNumber.from(slippageCalc.toString());
    }
    else {
      const countDecimals = slippage.split('.')[1].length;
      const denom = 100 * (10 ** countDecimals);
      const slippageCalc = denom - (Number(slippage) * (10 ** countDecimals))
      denominator = BigNumber.from(denom.toString());
      numerator = BigNumber.from(slippageCalc.toString())
    }
  }
  else {
    denominator = BigNumber.from("100")
    numerator = BigNumber.from("99")
  }

  if (library && userAddress && Number(amount) !== 0) {
    let amountIn
    let wrapEth
    let inputWrapWTON;
    let outputUnwrapTON;
    let outputUnwrapEth;

    if (address0.toLowerCase() === WTON_ADDRESS.toLowerCase() || address0.toLowerCase() === TON_ADDRESS.toLowerCase()) {
      amountIn = ethers.utils.parseUnits(amount, '27');
    }
    else {
      amountIn = ethers.utils.parseEther(amount)
    }
    wrapEth = address0.toLowerCase() === ZERO_ADDRESS.toLowerCase()
    inputWrapWTON = address0.toLowerCase() === TON_ADDRESS.toLowerCase();
    outputUnwrapTON = address1.toLowerCase() === TON_ADDRESS.toLowerCase();
    outputUnwrapEth = address1.toLowerCase() === ZERO_ADDRESS.toLowerCase();
    const quoteContract = new Contract(Quoter_ADDRESS, QuoterABI.abi, library);

    try {
      const amountOut = await quoteContract.callStatic.quoteExactInput(encoded, amountIn);                  
      const minimumAmountOut = amountOut.mul(numerator).div(denominator);
      if (address1.toLowerCase() === WTON_ADDRESS.toLowerCase() || outputUnwrapTON) {
        const converted = convertNumber({
          amount: minimumAmountOut,
          type: "ray",  
        });
  
        const formatted = converted && converted.indexOf(".") > -1 ? converted?.slice(
          0,
          converted?.indexOf(".") + 3
        ) : converted
  
  
        const convertedAmountOut = convertNumber({
          amount: amountOut,
          type: "ray",
        });
  
        const formattedAmountOut = convertedAmountOut && convertedAmountOut.indexOf(".") > -1 ? convertedAmountOut?.slice(
          0,
          convertedAmountOut?.indexOf(".") + 3
        ) : convertedAmountOut
  
        return { formatted, minimumAmountOut, amountIn, formattedAmountOut }
      }
      else {
        const converted = ethers.utils.formatEther(minimumAmountOut)
        const formatted = converted && converted.indexOf(".") > -1 ? converted?.slice(
          0,
          converted?.indexOf(".") + 3
        ) : converted
        const convertedAmountOut = ethers.utils.formatEther(amountOut)
        const formattedAmountOut = convertedAmountOut && convertedAmountOut.indexOf(".") > -1 ? convertedAmountOut?.slice(
          0,
          convertedAmountOut?.indexOf(".") + 3
        ) : convertedAmountOut
        return { formatted, minimumAmountOut, amountIn, formattedAmountOut }
      }
    }
    catch(err) {
      return {err}
    }
   
  }
}
export const swapAdvance = async (library: any, userAddress: string | null | undefined, pools: any, amount: string, slippage: string) => {
  const fees = pools.map((pool: any) => {
    return pool.fee
  })

  const tempTokenPath = pools.map((pool: any) => {
    // return pool.token0.address
    if (pool.token0.address.toLowerCase() === TON_ADDRESS.toLowerCase()) {
      return WTON_ADDRESS
    }
    else if (pool.token0.address.toLowerCase() === ZERO_ADDRESS.toLowerCase()) {
      return WETH_ADDRESS
    }
    else {
      return pool.token0.address
    }
  })
  const address1 = pools[pools.length - 1].token1.address
  const address0 = pools[0].token0.address
  tempTokenPath.push(address1)
  const encoded = encodePath(tempTokenPath, fees);

  let denominator;
  let numerator;
  const int = Number.isInteger(Number(slippage));

  if (slippage !== '' && Number(slippage) > 0 && Number(slippage) < 100) {
    if (int) {
      denominator = BigNumber.from("100")
      const slippageCalc = 100 - Number(slippage)
      numerator = BigNumber.from(slippageCalc.toString());
    }
    else {
      const countDecimals = slippage.split('.')[1].length;
      const denom = 100 * (10 ** countDecimals);
      const slippageCalc = denom - (Number(slippage) * (10 ** countDecimals))
      denominator = BigNumber.from(denom.toString());
      numerator = BigNumber.from(slippageCalc.toString())
    }
  }
  else {
    denominator = BigNumber.from("100")
    numerator = BigNumber.from("99")
  }

  if (library && userAddress && Number(amount) !== 0) {
    let amountIn
    let wrapEth
    let inputWrapWTON;
    let outputUnwrapTON;
    let outputUnwrapEth;

    if (address0.toLowerCase() === WTON_ADDRESS.toLowerCase() || address0.toLowerCase() === TON_ADDRESS.toLowerCase()) {
      amountIn = ethers.utils.parseUnits(amount, '27');
    }
    else {
      amountIn = ethers.utils.parseEther(amount)
    }
    wrapEth = address0.toLowerCase() === ZERO_ADDRESS.toLowerCase()
    inputWrapWTON = address0.toLowerCase() === TON_ADDRESS.toLowerCase();
    outputUnwrapTON = address1.toLowerCase() === TON_ADDRESS.toLowerCase();
    outputUnwrapEth = address1.toLowerCase() === ZERO_ADDRESS.toLowerCase();
    const quoteContract = new Contract(Quoter_ADDRESS, QuoterABI.abi, library);
    const amountOut = await quoteContract.callStatic.quoteExactInput(encoded, amountIn);    
    const minimumAmountOut = amountOut.mul(numerator).div(denominator);
    const signer = getSigner(library, userAddress);
    const swapperV2 = new Contract(SwapperV2Proxy, SwapperV2.abi, library);
    const getExactInputParams = {
      recipient: userAddress,
      path: encoded,
      amountIn: amountIn,
      amountOutMinimum: minimumAmountOut,
      deadline: 0
    }
    try {
      const tx = address0 !== ZERO_ADDRESS ? await exactInput(signer, swapperV2, getExactInputParams, wrapEth, outputUnwrapEth, inputWrapWTON, outputUnwrapTON) :
        await exactInputEth(signer, swapperV2, getExactInputParams, wrapEth, outputUnwrapEth, inputWrapWTON, outputUnwrapTON, {
          value: amountIn,
        });
      store.dispatch(setTxPending({ tx: true }));
      if (tx) {
        toastWithReceipt(tx, setTxPending, "Swapper");
      }
    }
    catch (err) {
      store.dispatch(setTxPending({ tx: false }));
      store.dispatch(
        //@ts-ignore
        openToast({
          payload: {
            status: "error",
            title: "Tx failed to send",
            description: `Something went wrong`,
            duration: 5000,
            isClosable: true,
          },
        })
      );
    }
  }

}

export const swapExactInput = async (library: any, userAddress: string | null | undefined, address0: string, address1: string, amount: string, slippage: string) => {
  const params = getParams(address0, address1);
  if (library && userAddress && params) {
    const amounts = await getExpectedOutput(library, userAddress, address0, address1, amount, slippage)
    const signer = getSigner(library, userAddress);
    const swapperV2 = new Contract(SwapperV2Proxy, SwapperV2.abi, library);
    const getExactInputParams = {
      recipient: userAddress,
      path: params?.path,
      amountIn: amounts?.amountIn,
      amountOutMinimum: amounts?.minimumAmountOut,
      deadline: 0
    }

    try {
      const tx = address0 !== ZERO_ADDRESS ? await exactInput(signer, swapperV2, getExactInputParams, params.wrapEth, params.outputUnwrapEth, params.inputWrapWTON, params.outputUnwrapTON) :
        await exactInputEth(signer, swapperV2, getExactInputParams, params.wrapEth, params.outputUnwrapEth, params.inputWrapWTON, params.outputUnwrapTON, {
          value: amounts?.amountIn,
        });
      store.dispatch(setTxPending({ tx: true }));
      if (tx) {
        toastWithReceipt(tx, setTxPending, "Swapper");
      }
    }
    catch (err) {
      store.dispatch(setTxPending({ tx: false }));
      store.dispatch(
        //@ts-ignore
        openToast({
          payload: {
            status: "error",
            title: "Tx failed to send",
            description: `Something went wrong`,
            duration: 5000,
            isClosable: true,
          },
        })
      );
    }
  }
  else {
    let amountIn
    if (address0.toLowerCase() === WTON_ADDRESS.toLowerCase()) {
      amountIn = ethers.utils.parseUnits(amount, '27');
    }
    else {
      amountIn = ethers.utils.parseEther(amount)
    }
    exactInputWtonTon(library, userAddress, address0, amountIn)
  }
}

export const swapExactOutput = async (library: any, userAddress: string | null | undefined, address0: string, address1: string, amount: string, slippage: string) => {
  //address1 = bottom token output token
  //address0 = top token input token
  const params = getParams(address0, address1);
  if (library && userAddress && params) {
    const amounts = await getExpectedInput(library, userAddress, address1, address0, amount, slippage)
    const quoteContract = new Contract(Quoter_ADDRESS, QuoterABI.abi, library);
    const signer = getSigner(library, userAddress);
    const swapperV2 = new Contract(SwapperV2Proxy, SwapperV2.abi, library);
    const getExactOutputParams = {
      recipient: userAddress,
      path: params?.path,
      amountOut: amounts?.amountOut,
      amountInMaximum: amounts?.maximumAmountIn,
      deadline: 0
    }
    const inputWrapWTON = address1.toLowerCase() === TON_ADDRESS.toLowerCase() ? true : false;
    const outputUnwrapTON = address0.toLowerCase() === TON_ADDRESS.toLowerCase() ? true : false
    const wrapEth = address1.toLowerCase() === ZERO_ADDRESS.toLowerCase() ? true : false;
    const outputUnwrapEth = address0.toLowerCase() === ZERO_ADDRESS.toLowerCase() ? true : false
    try {
      const tx = address1 !== ZERO_ADDRESS ? await exactOutput(signer, swapperV2, getExactOutputParams, wrapEth, outputUnwrapEth, inputWrapWTON, outputUnwrapTON) :
        await exactOutputEth(signer, swapperV2, getExactOutputParams, wrapEth, outputUnwrapEth, inputWrapWTON, outputUnwrapTON, {
          value: amounts?.maximumAmountIn,
        });
      store.dispatch(setTxPending({ tx: true, data: { name: 'swap' } }));
      if (tx) {
        toastWithReceipt(tx, setTxPending, "Swapper");
      }
    }
    catch (err) {
      store.dispatch(setTxPending({ tx: false, data: { name: 'swap' } }));
      store.dispatch(
        //@ts-ignore
        openToast({
          payload: {
            status: "error",
            title: "Tx failed to send",
            description: `Something went wrong`,
            duration: 5000,
            isClosable: true,
          },
        })
      );
    }

  }

  else {
    exactOutputWtonTon(library, userAddress, address0, amount)
  }
}

const exactOutputWtonTon = async (library: any, userAddress: string | null | undefined, address0: string, amount: any) => {
  if (library && userAddress) {
    const signer = getSigner(library, userAddress);
    const swapperV2 = new Contract(SwapperV2Proxy, SwapperV2.abi, library);
    if (address0 === WTON_ADDRESS) {
      const amnt = ethers.utils.parseEther(amount)
      try {
        const tx = await swapperV2.connect(signer).tonToWton(amnt)

        store.dispatch(setTxPending({ tx: true, data: { name: 'swap' } }));
        if (tx) {
          toastWithReceipt(tx, setTxPending, "Swapper");
        }
      }
      catch (err) {
        store.dispatch(setTxPending({ tx: false, data: { name: 'swap' } }));
        store.dispatch(
          //@ts-ignore
          openToast({
            payload: {
              status: "error",
              title: "Tx failed to send",
              description: `Something went wrong`,
              duration: 5000,
              isClosable: true,
            },
          })
        );
      }
    }
    else {
      const amnt = ethers.utils.parseUnits(amount, '27');
      try {
        const tx = await swapperV2.connect(signer).wtonToTon(amnt)
        store.dispatch(setTxPending({ tx: true, data: { name: 'swap' } }));
        if (tx) {
          toastWithReceipt(tx, setTxPending, "Swapper");
        }
      }
      catch (err) {
        store.dispatch(setTxPending({ tx: false, data: { name: 'swap' } }));
        store.dispatch(
          //@ts-ignore
          openToast({
            payload: {
              status: "error",
              title: "Tx failed to send",
              description: `Something went wrong`,
              duration: 5000,
              isClosable: true,
            },
          })
        );
      }

    }
  }
}

const exactInputWtonTon = async (library: any, userAddress: string | null | undefined, address0: string, amount: any) => {

  if (library && userAddress) {
    const signer = getSigner(library, userAddress);
    const swapperV2 = new Contract(SwapperV2Proxy, SwapperV2.abi, library);
    //wton to ton
    if (address0 === WTON_ADDRESS) {
      try {
        const tx = await swapperV2.connect(signer).wtonToTon(amount)

        store.dispatch(setTxPending({ tx: true, data: { name: 'swap' } }));
        if (tx) {
          toastWithReceipt(tx, setTxPending, "Swapper");
        }
      }
      catch (err) {
        store.dispatch(setTxPending({ tx: false, data: { name: 'swap' } }));
        store.dispatch(
          //@ts-ignore
          openToast({
            payload: {
              status: "error",
              title: "Tx failed to send",
              description: `Something went wrong`,
              duration: 5000,
              isClosable: true,
            },
          })
        );
      }

    }

    else {
      try {
        const tx = await swapperV2.connect(signer).tonToWton(amount)

        store.dispatch(setTxPending({ tx: true }));
        if (tx) {
          toastWithReceipt(tx, setTxPending, "Swapper");
        }
      }
      catch (err) {
        store.dispatch(setTxPending({ tx: false }));
        store.dispatch(
          //@ts-ignore
          openToast({
            payload: {
              status: "error",
              title: "Tx failed to send",
              description: `Something went wrong`,
              duration: 5000,
              isClosable: true,
            },
          })
        );
      }
    }
  }
}



