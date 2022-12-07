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
  Tooltip
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import Plus from "../assets/Plus.png";
import { PoolComponent } from "./PoolComponent";
import { useActiveWeb3React } from "../hooks/useWeb3";
import { SettingsComponent } from "./SettingsComponent";
import { useAppSelector } from "../hooks/useRedux";
import { selectTransactionType } from "../store/refetch.reducer";
import { selectTxType } from "../store/tx.reducer";
import { useAppDispatch } from "../hooks/useRedux";
import { openModal } from "../store/modal.reducer";
import {  getExpectedAdvanced } from "../actions/contractActions";
import {approve} from "../actions/contractActions";

type Token = {
  name: string;
  address: string;
  img: string;
};
export const AdvancedSwapper = (props: {
  setAdvanced: Dispatch<SetStateAction<any>>;
}) => {
  const theme = useTheme();
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  const { chainId, account, library } = useActiveWeb3React();
  const { setAdvanced } = props;
  const [slippage, setSlippage] = useState<string>("");
  const { tx, data } = useAppSelector(selectTxType);
  const [pools, setPools] = useState([{ token0: { name: "",
  address: "",
  img: "",}, token1: {}, fee: 0 }]);
  const [amount, setAmount] = useState<string>("0");
  const dispatch = useAppDispatch();
  const [disableBtn, setDisableBtn] = useState(true);
   const [expected, setExpected] = useState<string| undefined>('0')
   const [minExpected, setMinExpected] = useState<string| undefined>('')
   const [err, setErr] = useState(false)  
   const [allowed, setAllowed] = useState<number>(0);
   const [balance, setBalance] = useState<string>("0");
   const [isLabelOpen, setIsLabelOpen] = useState(false)

   const [selectedToken0, setSelectedToken0] = useState({
    name: "",
    address: "",
    img: "",
  });
  useEffect(() => {
    const arr = pools.filter(
      (pool: any) =>
        pool.fee === 0 ||
        pool.token0.address === "" ||
        pool.token1.address === "" ||
        pool.token0.address === pool.token1.address || allowed === 0 || Number(amount) > Number(balance) ||amount ==='' ||Number(amount) ===0
    );
    setDisableBtn(arr.length !== 0 || pools.length === 10);
  }, [pools,allowed,amount]);

useEffect(()=> {
  const token = pools[0].token0
  setSelectedToken0(token)
  
},[pools])

    useEffect(() => {    
    const getExpected = async() => {
      if (pools && amount) {        
        const getExptd= await getExpectedAdvanced(library,account,pools,amount,slippage)
        if (getExptd) {

          if (getExptd.err) {
            setErr(true)                        
          }
          else {                     
            setExpected(getExptd.formatted)
            setMinExpected(getExptd.formattedAmountOut)
          }
        }
        else {
          setExpected('0')
        }
      }
    }
    getExpected()
    }, [pools,amount]);
          
  return (
    <Flex
      width={"350px"}
      my="auto"
      mx={"auto"}
      borderRadius={"10px"}
      position={"relative"}
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
            Advanced Mode
          </Text>
          <Tooltip
                  label="Advanced mode is a mode provided for those who want to swap, which is not provided by our TONSwapper service.
Users must know the swap path to use this service and enter each address and fee.
Advanced mode allows for high slippage trades. Use this mode only if you know what you are doing."
                  bg="#ffffff"
                  color={"3d495d"}
                  border={'2px solid #257eee'}
                  placement='bottom'
                  isOpen={isLabelOpen}
                >
                  <QuestionOutlineIcon ml="9px"  onMouseEnter={()=>setIsLabelOpen(true)}
                  onMouseLeave={()=>setIsLabelOpen(false)} onClick={() => setIsLabelOpen(!isLabelOpen)}/>
                </Tooltip>
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

      {pools.map((pool: any, index: number) => {
        return (
          <PoolComponent
            // expanded={index === 0 ? true : false}
            pool={pool}
            expanded={true}
            deletable={index === 0 ? false : true}
            key={index}
            setPools={setPools}
            setAmount={setAmount}
            setAllowed={setAllowed}
            setBalance={setBalance}
            pools={pools}
            poolNum={index}
            amount={amount}
            slippage={slippage}
          />
        );
      })}
      <Button
        border={"1px solid #dfe4ee"}
        borderRadius="10px"
        mb="8px"
        width={"350px"}
        h={"66px"}
        bg="#fff"
        justifyContent={"center"}
        alignItems="center"
        disabled={disableBtn}
        onClick={() => {
          setPools(pools.concat([{ token0: { name: "",
          address: "",
          img: "",}, token1: {}, fee: 0 }]));
        }}
        _hover={{ cursor: "pointer" }}
      >
        <Image src={Plus} h="26px" w="26px" />
        <Text ml="8px" fontWeight={"normal"}>
          Add another swap
        </Text>
      </Button>
      <Flex
        border={"1px solid #dfe4ee"}
        borderRadius="10px"
        width={"350px"}
        h={"100%"}
        bg="#fff"
        p="20px"
        justifyContent={"center"}
        flexDir="column"
      >
          <Flex
        alignItems={"center"}
        justifyContent="space-between"
        h={"24px"}
        mb={"12px"}
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
            !account || allowed !== 0||
            selectedToken0.address === ZERO_ADDRESS
          }
          onClick={() =>
            approve(
              account,
              library,
              selectedToken0.address,
              setAllowed
            )
          }
        >
          Approve
        </Button>
      </Flex>
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
          disabled={disableBtn}
          _hover={{}}
          _active={{}}
          onClick={() => {
            dispatch(
              openModal({
                type: "swap_summary",
                data: { pools, amount, slippage,expected,minExpected },
              })
            );
          }}
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
