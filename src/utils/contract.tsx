import { getAddress } from "@ethersproject/address";
import { Contract } from "@ethersproject/contracts";
import { AddressZero } from "@ethersproject/constants";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";

import * as TonABI from "../services/abis/TON.json";
import * as WtonABI from "../services/abis/WTON.json";

import { DEPLOYED } from "../constants/index";

const { TON_ADDRESS, WTON_ADDRESS } = DEPLOYED;

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}
// account is not optional
export function getSigner(
  library: Web3Provider,
  account: string
): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(
  library: Web3Provider,
  account?: string
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

export function getTokamakContract(
  want: string,
  library?: Web3Provider,
  address?: string
): any {
  const TON = new Contract(TON_ADDRESS, TonABI.abi, library);
  const WTON = new Contract(WTON_ADDRESS, WtonABI.abi, library);

  if (want === "TON") {
    return TON;
  } else if (want === "WTON") {
    return WTON;
  } else {
    throw Error("Invalid contract name!");
  }
}

// account is optional
export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return new Contract(
    address,
    ABI,
    getProviderOrSigner(library, account) as any
  );
}
