import { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  Text,
  Flex,
  useTheme,
  Button,
  NumberInput,
  NumberInputField,
  Box,
  Image,
  CircularProgress,
  Switch,
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import Plus from "../assets/Plus.png";
import { PoolComponent } from "./PoolComponent";
import { useActiveWeb3React } from "../hooks/useWeb3";
import { SettingsComponent } from "./SettingsComponent";
import { useAppSelector } from "../hooks/useRedux";
import { selectTransactionType } from "../store/refetch.reducer";
import { selectTxType } from "../store/tx.reducer";

export const AdvancedSwapper = (props: {
  setAdvanced: Dispatch<SetStateAction<any>>;
}) => {
  const theme = useTheme();
  const { chainId, account, library } = useActiveWeb3React();
  const { setAdvanced } = props;
  const [token0Balance, setToken0Balance] = useState<string>("0");
  const [slippage, setSlippage] = useState<string>("");
  const { tx, data } = useAppSelector(selectTxType);
  const [pools, setPools] = useState([{address0:'', address1:'', fee:''}])
  console.log(pools);
  
  return (
    <Flex
      width={"350px"}
      my="auto"
      mx={"auto"}
      borderRadius={"10px"}
      position={"relative"}
      // boxShadow={"0px 1px 1px 0px rgba(0,0,0,0.16)"}
      // backgroundColor={"#fff"}
      flexDirection={"column"}
      p="20px"
      fontFamily={theme.fonts.roboto}
    >
      <Flex
        width={"350px"}
        h="59px"
        bg="#3d495d"
        borderRadius={"10px"}
        flexDir="row"
        justifyContent={"center"}
        alignItems="center"
        px="21px"
        color={"#fff"}
        mb="10px"
      >
        <Flex alignItems={"center"} flexDir="row" w="100%">
          <Text fontSize={"16px"} fontWeight="bold">
            Advance Mode
          </Text>
          <QuestionOutlineIcon ml="9px" />
        </Flex>
        <Switch
          isChecked
          h="20px"
          w="40px"
          onChange={() => {
            {
              setAdvanced(false);
            }
          }}
        />
      </Flex>

          {pools.map((pool:any, index:number) => {
            return (
              <PoolComponent expanded={index === 0? true:false}  deletable={index === 0? false:true} key={index} setPools={setPools} pools={pools} poolNum={index}/>
            )
          
          })}
      <Flex
        border={"1px solid #dfe4ee"}
        borderRadius="10px"
        mb="8px"
        width={"350px"}
        h={"66px"}
        bg="#fff"
        justifyContent={"center"}
        alignItems="center"
        onClick={() => {setPools(pools.concat([{address0:'', address1:'', fee:''}]))}}
        _hover={{cursor:'pointer'}}
      >
        <Image src={Plus} h="26px" w="26px" />
        <Text ml="8px">Add another address</Text>
      </Flex>
      <Flex
        border={"1px solid #dfe4ee"}
        borderRadius="10px"
        width={"350px"}
        h={"144px"}
        bg="#fff"
        p="20px"
        justifyContent={"center"}
        flexDir='column'
      >
        <SettingsComponent
          setSlippage={setSlippage}
          focused={"input1"}
          advanced={true}
        />
        <Button
          borderRadius={"28px"}
          border={"none"}
          padding={"16px 118px"}
          // cursor={
          //   !Number(swapFromAmt) || !account || invalidInput ? "not-allowed" : "pointer"
          // }
          w={"310px"}
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
        >
          {tx === true && !data ? (
            <CircularProgress
              isIndeterminate
              size={"32px"}
              zIndex={100}
              color="blue.500"
              pos="absolute"
            ></CircularProgress>
          ) : (
            <Text>{!account ? "Connect Wallet" : "Swap"}</Text>
          )}
        </Button>
      </Flex>
    </Flex>
  );
};
