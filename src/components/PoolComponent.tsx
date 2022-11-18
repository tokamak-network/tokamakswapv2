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
import expand from "../assets/expand.png";
import Delete from "../assets/Delete.png";
import { SelectToken } from "./SelectToken";
import { useActiveWeb3React } from "../hooks/useWeb3";
import { useAppSelector } from "../hooks/useRedux";
import { DEPLOYED } from "../constants";
import ETH_symbol from "../assets/ETH_symbol.png";

import { selectTransactionType } from "../store/refetch.reducer";
import {
  getUserTokenBalance,
  approve,
  checkApproved,
  swapExactInput,
  getExpectedOutput,
  getExpectedInput,
  swapExactOutput,
} from "../actions/contractActions";
export const PoolComponent = (props: {
  expanded: boolean;
  deletable: boolean;
  setPools: Dispatch<SetStateAction<any>>;
  pools: any;
  poolNum: number;
}) => {
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  const { WETH_ADDRESS } = DEPLOYED;

  const FeeAmount = [500, 3000, 10000];
  const { expanded, deletable, setPools, pools, poolNum } = props;
  const [open, setOpen] = useState(false);
  const { chainId, account, library } = useActiveWeb3React();
  const [token0Balance, setToken0Balance] = useState<string>("0");
  const [allowed, setAllowed] = useState<number>(0);
  const [swapFromAmt, setSwapFromAmt] = useState<string>("0");
  const [invalidInput, setInvalidInput] = useState<boolean>(false);
  const [fee, setFee] = useState(0);
  const { transactionType, blockNumber } = useAppSelector(
    selectTransactionType
  );

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

  useEffect(() => {
    setOpen(expanded);
  }, [expanded]);

  useEffect(() => {
    const getBalances = async () => {
      if (!account || !library) {
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

  const formatNumberWithCommas = (num: string) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Flex
      border={"1px solid #dfe4ee"}
      borderRadius="10px"
      mb="8px"
      width={"350px"}
      h={
        !open ? (deletable ? "107px" : "150px") : deletable ? "270px" : "346px"
      }
      bg="#fff"
      p="20px"
      flexDir={"column"}
    >
      <Flex
        justifyContent={"space-between"}
        alignItems="center"
        h="21px"
        w="100%"
      >
        <Text fontSize={"18px"} color="#3d495d" fontWeight={"bold"} h="21px">
          {selectedToken0.name ? selectedToken0.name : " Token 1"} {`${`>`}`}{" "}
          {selectedToken1.name ? selectedToken1.name : "Token 2"}
        </Text>
        <Flex>
          {open && deletable && (
            <Image
              src={Delete}
              h="16px"
              w="16px"
              mr="16px"
              onClick={() => {
                // setPools(pools.splice(poolNum,1))
                const temp = [...pools];
               temp.splice(poolNum-1,1)
               setPools(temp)

                
              }}
            />
          )}
          <Image
            src={expand}
            h="16px"
            w="16px"
            onClick={() => setOpen(!open)}
          />
          <Text>{poolNum}</Text>
        </Flex>
      </Flex>
      {open ? (
        <Flex mt="24px" flexDir={"column"}>
          <SelectToken
            setToken={setSelectedToken0}
            selectedToken={selectedToken0}
          />
          {!deletable && (
            <Flex flexDir={"column"}>
              <Text
                textAlign={"left"}
                mt="17px"
                fontSize="14px"
                color="#3d495d"
              >
                Balance: {formatNumberWithCommas(token0Balance)}
              </Text>
              <Flex
                position={"relative"}
                border={
                  invalidInput ? "solid 1px #e53e3e" : "solid 1px #dfe4ee"
                }
                height={"36px"}
                w={"310px"}
                mt="5px"
                flexDir={"row"}
                borderRadius={"18px"}
                justifyContent={"space-between"}
                alignItems={"center"}
                pr={"18px"}
                mb="17px"
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
            </Flex>
          )}
          <Flex mt={deletable ? "17px" : ""}>
            <SelectToken
              setToken={setSelectedToken1}
              selectedToken={selectedToken1}
            />
          </Flex>
          <Flex mt="17px" h="35px" justifyContent={"space-between"}>
            {FeeAmount.map((fee: any, index: number) => (
              <Flex
                key={index}
                border={"1px solid #dfe4ee"}
                w="100px"
                borderRadius={"17.5"}
                justifyContent="center"
                alignItems={"center"}
                onClick={() => {
                  setFee(fee);
                }}
                _hover={{ cursor: "pointer" }}
              >
                <Text color="#3d495d" fontSize={"16px"} fontWeight="bold">
                  {fee / 10000}%{" "}
                </Text>
                <Text
                  ml="2px"
                  color="#3d495d"
                  fontSize={"10px"}
                  fontWeight="normal"
                >
                  ({Number(fee).toLocaleString()})
                </Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      ) : (
        <Flex flexDir={"column"} h="35px" mt="11px">
          <Flex
            justifyContent={
              selectedToken0.address && selectedToken1.address
                ? "space-between"
                : "left"
            }
            w="310px"
          >
            <Flex
              w="100px"
              border={"1px solid #dfe4ee"}
              h="35px"
              borderRadius={"17.5"}
              px="5px"
              mr={selectedToken0.address && selectedToken1.address ? "" : "5px"}
              // justifyContent="center"
              alignItems={"center"}
            >
              {" "}
              {selectedToken0.address ? (
                <Image
                  src={
                    selectedToken0.address === ZERO_ADDRESS ||
                    selectedToken0.address === WETH_ADDRESS
                      ? ETH_symbol
                      : selectedToken0.img
                  }
                  h="25px"
                  border={"1px solid #dfe4ee"}
                  borderRadius="50%"
                />
              ) : (
                <Flex
                  h="25px"
                  w="25px"
                  bg="#e7edf3"
                  borderRadius={"50%"}
                ></Flex>
              )}
              <Text
                ml="8px"
                color="#3e495c"
                fontWeight={"bold"}
                fontSize="16px"
              >
                {selectedToken0.name}
              </Text>
            </Flex>
            <Flex
              w="100px"
              border={"1px solid #dfe4ee"}
              h="35px"
              borderRadius={"17.5"}
              px="5px"
              // justifyContent="center"
              alignItems={"center"}
            >
              {selectedToken1.address ? (
                <Image
                  src={
                    selectedToken1.address === ZERO_ADDRESS ||
                    selectedToken1.address === WETH_ADDRESS
                      ? ETH_symbol
                      : selectedToken1.img
                  }
                  h="25px"
                  border={"1px solid #dfe4ee"}
                  borderRadius="50%"
                />
              ) : (
                <Flex
                  h="25px"
                  w="25px"
                  bg="#e7edf3"
                  borderRadius={"50%"}
                ></Flex>
              )}
              <Text
                ml="8px"
                color="#3e495c"
                fontWeight={"bold"}
                fontSize="16px"
              >
                {selectedToken1.name}
              </Text>
            </Flex>
            {selectedToken0.address && selectedToken1.address && (
              <Flex
                w="100px"
                border={"1px solid #dfe4ee"}
                h="35px"
                borderRadius={"17.5"}
                px="5px"
                justifyContent="center"
                alignItems={"center"}
              >
                <Text color="#3d495d" fontSize={"16px"} fontWeight="bold">
                  {fee / 10000}%{" "}
                </Text>
                <Text
                  ml="2px"
                  color="#3d495d"
                  fontSize={"10px"}
                  fontWeight="normal"
                >
                  ({Number(fee).toLocaleString()})
                </Text>
              </Flex>
            )}
          </Flex>
          {!deletable && (
            <Flex
              w="310px"
              border="1px solid #e7edf3"
              h="34px"
              borderRadius={"18px"}
              mt="7px"
              alignItems={"center"}
            >
              <Text
                h="24px"
                my="6px"
                ml="14px"
                fontSize={"14px"}
                color={"#3e495c"}
              >
                Amount: 100
              </Text>
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  );
};
