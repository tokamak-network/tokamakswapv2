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
import {
  getUserWtonBalance,
  getUserTonBalance,
  swapWtonToTon,
  swapTonToWton,
} from "../actions/contractActions";

export const Swapper = () => {
  const theme = useTheme();
  const { chainId, account, library } = useActiveWeb3React();
  const { tx } = useAppSelector(selectTxType);
  const { transactionType, blockNumber } = useAppSelector(
    selectTransactionType
  );

  const [tonBalance, setTonBalance] = useState<string>("0");
  const [wtonBalance, setWtonBalance] = useState<string>("0");
  const [swapFromAmt, setSwapFromAmt] = useState<string>("0");
  const [invalidInput, setInvalidInput] = useState<boolean>(false);
  useEffect(() => {
    if (chainId !== Number(DEFAULT_NETWORK) && chainId !== undefined) {
      const netType =
        DEFAULT_NETWORK === 1 ? "mainnet" : "Goerli Test Network";
      //@ts-ignore
      // dispatch(fetchUserInfo({reset: true}));
      setTonBalance("0");
      setWtonBalance("0");
      return alert(`Please use ${netType}`);
    }
    /*eslint-disable*/
  }, [chainId]);

  useEffect(() => {
    const getBalances = async () => {
      if (!account || !library) {
        return;
      }
      const tempTonBalance = await getUserTonBalance({ account, library });
      if (tempTonBalance) {
        setTonBalance(tempTonBalance);
      }
      const tempWtonBalance = await getUserWtonBalance({ account, library });
      if (tempWtonBalance) {
        setWtonBalance(tempWtonBalance);
      }
    };
    getBalances();
  }, [account, library, transactionType, blockNumber]);

  return (
    <Flex
      width={"350px"}
      //   alignItems={"center"}
      margin={"0px auto"}
      borderRadius={"10px"}
      // height="606px"
      position={"relative"}
      boxShadow={"0px 1px 1px 0px rgba(0,0,0,0.16)"}
      backgroundColor={"#fff"}
      flexDirection={"column"}
     
      p="20px"
      fontFamily={theme.fonts.roboto}
    >
      <SelectToken  />
      <Text mt="18px" mb="8px" textAlign={"left"}>
        Balance: {tonBalance}
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
          <Image src={swap} maxWidth={17} w={17} />
        </Button>
      </Flex>
      <SelectToken/>
      <Text mt="18px" mb="8px" textAlign={"left"}>
        Balance: {tonBalance}
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
      <ConversionComponent/>
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
      >
        <Text>{account ? "Select Tokens" : "Connect Wallet"} </Text>
      </Button>
    </Flex>
  );
};
