import { useState, useEffect } from "react";
import {
  Text,
  Flex,
  useTheme,
  Button,
  NumberInput,
  NumberInputField,
  Box,
  Image,
} from "@chakra-ui/react";
import { useActiveWeb3React } from "../hooks/useWeb3";
import { DEFAULT_NETWORK } from "../constants";
import { selectTxType } from "../store/tx.reducer";
import { useAppSelector } from "../hooks/useRedux";
import { selectTransactionType } from "../store/refetch.reducer";
import { ethers } from "ethers";
import { SelectToken } from "./SelectToken";
import swap from "../assets/swap.png";
import { ConversionComponent } from "./ConversionComponent";
import { SettingsComponent } from "./SettingsComponent";
import { DEPLOYED } from "../constants";

import {
  getUserTokenBalance,
  approve,
  checkApproved,
  swapExactInput,
  getExpectedOutput
} from "../actions/contractActions";

export const Swapper = () => {
  const theme = useTheme();
  const { chainId, account, library } = useActiveWeb3React();
  const { tx } = useAppSelector(selectTxType);
  const { transactionType, blockNumber } = useAppSelector(
    selectTransactionType
  );

  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  const { WETH_ADDRESS } = DEPLOYED;
  const [swapFromAmt, setSwapFromAmt] = useState<string>("0");
  const [invalidInput, setInvalidInput] = useState<boolean>(false);
  const [allowed, setAllowed] = useState<number>(0);
  const [expected, setExpected] = useState<string>('0')
  const [selectedToken0, setSelectedToken0] = useState({
    name: "",
    address: "",
    img: "",
  });
  const [selectedToken1, setSelectedToken1] = useState({
    name: "",
    address: "",
    img: "",
  });
  const [token0Balance, setToken0Balance] = useState<string>("0");
  const [token1Balance, setToken1Balance] = useState<string>("0");

  useEffect(() => {
    if (chainId !== Number(DEFAULT_NETWORK) && chainId !== undefined) {
      const netType = DEFAULT_NETWORK === 1 ? "mainnet" : "Goerli Test Network";
      //@ts-ignore
      // dispatch(fetchUserInfo({reset: true}));

      return alert(`Please use ${netType}`);
    }
    /*eslint-disable*/
  }, [chainId]);

  useEffect(() => {
    const getBalances = async () => {
      if (!account || !library) {
        // setToken0Balance("0");
        // setToken1Balance("0");
        // setSelectedToken0({ name: "", address: "", img: "" });
        // setSelectedToken1({ name: "", address: "", img: "" });
        return;
      }

      if (selectedToken0.address !== "") {
        const tempToken0Balance = await getUserTokenBalance(
          account,
          library,
          selectedToken0.address
        );
        if (tempToken0Balance) {
          setToken0Balance(tempToken0Balance);
        }
      }
      if (selectedToken1.address !== "") {
        const tempToken1Balance = await getUserTokenBalance(
          account,
          library,
          selectedToken1.address
        );
        if (tempToken1Balance) {
          setToken1Balance(tempToken1Balance);
        }
      }
    };

    const checkAllowed = async () => {
      if (
        account === null ||
        account === undefined ||
        library === undefined ||
        selectedToken0.address === ""
      ) {
        return;
      }
      if (selectedToken0.address === ZERO_ADDRESS) {
        const balance = await getUserTokenBalance(
          account,
          library,
          selectedToken0.address
        );
        setAllowed(Number(balance));
      } else {
        checkApproved(library, account, setAllowed, selectedToken0.address);
      }
    };
    getBalances();
    checkAllowed();
  }, [
    account,
    library,
    transactionType,
    blockNumber,
    selectedToken0,
    selectedToken1,
  ]);

  useEffect (() => {
    const getExpected = async() => {
      if (selectedToken0.address && selectedToken1.address && swapFromAmt !== '') {
        const tempAmount = await getExpectedOutput(library, account, selectedToken0.address, selectedToken1.address, swapFromAmt)

       setExpected(tempAmount? tempAmount.slice(0, tempAmount.indexOf('.')+3): '0')
      }
      else {
        setExpected('0')
      }
    }
    getExpected()
   
  },[swapFromAmt, selectedToken0.address, selectedToken1.address])


  const formatNumberWithCommas = (num: string) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const switchTokens = () => {
    const token0 = selectedToken1;
    const token1 = selectedToken0;
    setSelectedToken0(token0);
    setSelectedToken1(token1);
  };

  return (
    <Flex
      width={"350px"}
      //   alignItems={"center"}
      mt={"54px"}
      mx={"auto"}
      borderRadius={"10px"}
      // height="606px"
      position={"relative"}
      boxShadow={"0px 1px 1px 0px rgba(0,0,0,0.16)"}
      backgroundColor={"#fff"}
      flexDirection={"column"}
      p="20px"
      fontFamily={theme.fonts.roboto}
    >
      <SelectToken
        setToken={setSelectedToken0}
        selectedToken={selectedToken0}
      />
      <Flex justifyContent={"space-between"} alignItems="center">
        <Text mt="18px" mb="8px" textAlign={"left"}>
          Balance: {formatNumberWithCommas(token0Balance)}
        </Text>
        <Text
          fontSize={"14px"}
          color={"#3d495d"}
          fontWeight="bold"
          onClick={() => setSwapFromAmt(token0Balance)}
          _hover={{ cursor: "pointer" }}
        >
          MAX
        </Text>
      </Flex>

      <Flex
        position={"relative"}
        border={invalidInput ? "solid 1px #e53e3e" : "solid 1px #dfe4ee"}
        height={"56px"}
        w={"310px"}
        flexDir={"row"}
        borderRadius={"4px"}
        justifyContent={"space-between"}
        alignItems={"center"}
        pr={"18px"}
      >
        <NumberInput
          height={"56px"}
          w={"230px"}
          color={"#86929d"}
          pl={"24px"}
          border={"none"}
          fontSize={"18px"}
          borderRadius={"4px"}
          borderColor={"transparent"}
          _focus={{
            borderColor: "transparent",
          }}
          _active={{
            borderColor: "transparent",
          }}
          focusBorderColor="transparent"
          _hover={{
            borderColor: "transparent",
          }}
          defaultValue={0}
          value={swapFromAmt}
          onChange={(e) => {
            const valueNum = e;
            setSwapFromAmt(valueNum);
          }}
        >
          <NumberInputField
            border={"none"}
            height={"56px"}
            outline={"none"}
            borderColor={"transparent"}
            pl={"0px"}
          />
        </NumberInput>
      </Flex>
      <Flex
        h={"40px"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDir={"row"}
        my="18px"
      >
        <Box h={"1px"} bg={"#e9edf1"} w="310px"></Box>
        <Button
          position={"absolute"}
          w={"40px"}
          h={"40px"}
          backgroundColor={"#e9edf1"}
          borderRadius={"50%"}
          //   onClick={switchTokens}
        >
          <Image
            src={swap}
            maxWidth={17}
            w={17}
            onClick={() => switchTokens()}
          />
        </Button>
      </Flex>
      <SelectToken
        setToken={setSelectedToken1}
        selectedToken={selectedToken1}
      />
      <Text mt="18px" mb="8px" textAlign={"left"}>
        Balance: {formatNumberWithCommas(token1Balance)}
      </Text>
      <Flex
        position={"relative"}
        border={invalidInput ? "solid 1px #e53e3e" : "solid 1px #dfe4ee"}
        height={"56px"}
        w={"310px"}
        flexDir={"row"}
        borderRadius={"4px"}
        justifyContent={"space-between"}
        alignItems={"center"}
        pr={"18px"}
      >
        <NumberInput
          height={"56px"}
          w={"310px"}
          color={"#86929d"}
          pl={"24px"}
          border={"none"}
          fontSize={"18px"}
          borderRadius={"4px"}
          borderColor={"transparent"}
          _focus={{
            borderColor: "transparent",
          }}
          _active={{
            borderColor: "transparent",
          }}
          focusBorderColor="transparent"
          _hover={{
            borderColor: "transparent",
          }}
          defaultValue={0}
          value={expected}
          onChange={(e) => {
            const valueNum = e;
            setSwapFromAmt(valueNum);
          }}
        >
          <NumberInputField
            border={"none"}
            height={"56px"}
            outline={"none"}
            borderColor={"transparent"}
            pl={"0px"}
          />
        </NumberInput>
      </Flex>
      <Flex
        alignItems={"center"}
        justifyContent="space-between"
        h={"24px"}
        my={"12px"}
      >
        <Text fontSize={"10px"}>
          Tokamak Swap Protocol wants to use your{" "}
          {selectedToken0.name ? selectedToken0.name : "tokens"}
        </Text>
        <Button
          backgroundColor={"#007aff"}
          color={"#fff"}
          h={"24px"}
          w={"72px"}
          fontSize={"14px"}
          fontWeight="normal"
          borderRadius={"12px"}
          _disabled={{
            backgroundColor: "#e9edf1",
            color: "#8f96a1",
          }}
          _hover={{}}
          _active={{}}
          disabled={
            selectedToken0.address === "" ||
            !account ||
            swapFromAmt === "0" ||
            Number(swapFromAmt) <= allowed || 
            selectedToken0.address === ZERO_ADDRESS
          }
          onClick={() =>
            approve(
              account,
              library,
              selectedToken0.address,
              swapFromAmt,
              setAllowed
            )
          }
        >
          Approve
        </Button>
      </Flex>
      <ConversionComponent expectedAmnt={expected} symbol={selectedToken1.name}/>
      <SettingsComponent />
      <Button
        borderRadius={"28px"}
        border={"none"}
        padding={"16px 118px"}
        mb={"10px"}
        // cursor={
        //   !Number(swapFromAmt) || !account || invalidInput ? "not-allowed" : "pointer"
        // }
        w={"280px"}
        backgroundColor={account ? "#007aff" : "#e9edf1"}
        color={account ? "#fff" : "#8f96a1"}
        height={"56px"}
        fontSize={"18px"}
        fontWeight="normal"
        _disabled={{
          backgroundColor: "#e9edf1",
          color: "#8f96a1",
        }}
        _hover={{}}
        _active={{}}
        disabled={
          selectedToken0.address === "" ||
          selectedToken1.address === "" ||
          Number(swapFromAmt) > allowed ||
          Number(swapFromAmt) === 0 ||
          selectedToken0.address === selectedToken1.address ||
          (selectedToken0.address === ZERO_ADDRESS &&
            selectedToken1.address === WETH_ADDRESS) || 
            (selectedToken0.address === WETH_ADDRESS &&
              selectedToken1.address === ZERO_ADDRESS)
        }
        onClick={() =>
          swapExactInput(
            library,
            account,
            selectedToken0.address,
            selectedToken1.address,
            swapFromAmt
          )
        }
      >
        <Text>
          {account
            ? selectedToken0.address === "" || selectedToken1.address === ""
              ? "Select Tokens"
              : "Swap"
            : "Connect Wallet"}{" "}
        </Text>
      </Button>
    </Flex>
  );
};
