import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import {
  Text,
  Flex,
  Image,
  Input,
  Box,
  Button,
  Avatar,
  Link,
} from "@chakra-ui/react";
import icon_arrow from "../assets/icon_arrow.png";
import TON_symbol from "../assets/TON_symbol.svg";
import getTokensData from "../actions/fetch";
import ETH_symbol from "../assets/ETH_symbol.png";
import { ImportTokenModal } from "./ImportTokenModal";
import { useAppDispatch } from "../hooks/useRedux";
import { openModal } from "../store/modal.reducer";
import { ethers } from "ethers";
import * as TONABI from "../services/abis/TON.json";
import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import { getSigner } from "../utils/contract";
import { DEFAULT_NETWORK, ETHERSCAN_URL } from "../constants";
import {addToken} from '../actions/contractActions'
type selectedToken = {
  name: string;
  address: string;
  img: string;
};
export const SelectToken = (props: {
  setToken: Dispatch<SetStateAction<any>>;
  selectedToken: selectedToken;
}) => {
  const { setToken, selectedToken } = props;
  const [selected, setSelected] = useState({ name: "", img: "" });
  const wrapperRef = useRef(null);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [tokensFromAPI, setTokensFromAPI] = useState<any>([]);
  const [searchToken, setSearchToken] = useState({
    name: "",
    address: "",
    symbol: "",
  });
  const [validAddress, setValidAddress] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>("");
  const { account, library } = useWeb3React();
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  const dispatch = useAppDispatch();

  useEffect(() => {
    async function getTokens() {
      const tokens: any = await getTokensData();
      const tokensOrdered: any[] = [];

      const Eth = {
        token: {
          address: ZERO_ADDRESS,
          symbol: "ETH",
          name: "Ether",
        },
        tokenAddress: ZERO_ADDRESS,
        tokenImage: "",
      };

      DEFAULT_NETWORK === 1
        ? tokensOrdered.push(
            Eth,
            tokens[7],
            tokens[4],
            tokens[2],
            tokens[1],
            tokens[0],
            tokens[3],
            tokens[6]
          )
        : tokensOrdered.push(
            Eth,
            tokens[5],
            tokens[6],
            tokens[0],
            tokens[2],
            tokens[1],
            tokens[3],
            tokens[4]
          );

      setTokensFromAPI(tokensOrdered);

      setSelected({ name: selectedToken.name, img: selectedToken.img });
    }
    getTokens();
  }, [selectedToken]);

  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setExpanded(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  useOutsideAlerter(wrapperRef);

  useEffect(() => {
    const isAddress = ethers.utils.isAddress(searchString);
    setValidAddress(isAddress);
  }, [searchString]);

  useEffect(() => {
    async function getToken() {
      if (account === null || account === undefined || library === undefined) {
        return;
      } else {
        const signer = getSigner(library, account);
        try {
          const contract = new Contract(searchString, TONABI.abi, library);
          const symbolContract = await contract.connect(signer).symbol();
          const decimalContract = await contract.connect(signer).decimals();
          const nameContract = await contract.connect(signer).name();
          // setDecimal(decimalContract);
          // setSymbol(symbolContract);
          // setName(nameContract);
          setSearchToken({
            name: nameContract,
            address: searchString,
            symbol: symbolContract,
          });
        } catch (err) {}
      }
    }
    getToken();
  }, [searchString, validAddress]);

  const TokenComp = (props: { img: any; name: string; address: string }) => {
    const { img, name, address } = props;

    return (
      <Flex
        h="44px"
        alignItems={"center"}
        zIndex={1000}
        justifyContent="space-between"
        onClick={() => {
          setSelected({ name: name, img: img });
          setExpanded(false);
          setToken({ name: name, address: address, img: img });
        }}
        _hover={{ cursor: "pointer" }}
      >
        <Flex alignItems={"center"}>
          <Image
            border="1px solid #e7edf3"
            src={img !== undefined && img !== "" ? img : ETH_symbol}
            h="32px"
            w="32px"
            mr="9px"
            borderRadius={"50%"}
          />

          <Text>{name}</Text>
        </Flex>
      
          <Text fontSize={"10px"} _hover={{textDecor:'underline'}}  onClick={()=> {addToken(address, library,img)}}>Import</Text>
      
      </Flex>
    );
  };

  const NewTokenComp = (props: { symbol: string; address: string }) => {
    const { symbol, address } = props;
    return (
      <Flex
        h="44px"
        alignItems={"center"}
        zIndex={1000}
        justifyContent="space-between"
      >
        <Flex alignItems={"center"}>
          <Avatar name={symbol} h="32px" w="32px" mr="9px" />
          <Text>{symbol}</Text>
        </Flex>
        <Button
          h="24px"
          w="72px"
          bg={"#257eee"}
          color="white.100"
          fontSize={14}
          fontWeight="normal"
          borderRadius={"28px"}
          _hover={{}}
          _active={{}}
          onClick={() => {
            dispatch(
              openModal({
                type: "import_tokens",
                data: {
                  tokenAddress: address,
                  setSelected,
                  setToken,
                  setSearchString,
                },
              })
            );
          }}
        >
          Import
        </Button>
      </Flex>
    );
  };

  return (
    <Flex w={"310px"} flexDir="column" ref={wrapperRef}>
      <Flex
        w="100%"
        h={"56px"}
        border={"solid 1px #dfe4ee"}
        borderRadius="28px"
        p="8px"
        alignItems="center"
        onClick={() => setExpanded(!expanded)}
        _hover={{ cursor: "pointer" }}
        zIndex={expanded ? 1000 : 0}
      >
        <Flex alignItems="center" justifyContent={"space-between"} w="100%">
          {selected.name === "" ? (
            <Flex alignItems="center">
              <Box w="40px" h="40px" borderRadius={"50%"} bg="#dfe4ee"></Box>
              <Text
                color={"#3d495d"}
                fontSize="18px"
                ml="10px"
                fontWeight={"normal"}
              >
                Select a token
              </Text>
            </Flex>
          ) : (
            <Flex alignItems="center">
              {selected.img === "" || !selected.img? (
                selected.name === "ETH" || selected.name === "WETH" ? (
                  <Image
                    w="40px"
                    h="40px"
                    borderRadius={"50%"}
                    src={ETH_symbol}
                  ></Image>
                ) : (
                  <Avatar name={selected.name} w="40px" h="40px" />
                )
              ) : (
                <Image
                  w="40px"
                  h="40px"
                  borderRadius={"50%"}
                  border={"1px solid #e7edf3"}
                  src={selected.img}
                ></Image>
              )}

              <Text
                color={"#3d495d"}
                fontSize="18px"
                ml="10px"
                fontWeight={"normal"}
              >
                {selected.name}
              </Text>
            </Flex>
          )}

          <Image src={icon_arrow} h="14px" w="14px" mr="16px" />
        </Flex>
      </Flex>
      {expanded && (
        <Flex
          flexDir={"column"}
          w="310px"
          position={"absolute"}
          bg="#fff"
          mt="28px"
          zIndex={100}
          borderX={"solid 1px #dfe4ee"}
          borderBottom="solid 1px #dfe4ee"
          borderBottomRadius={"28px"}
          px="15px"
          pt={"42px"}
          pb={"10px"}
        >
         
          {searchString === "" ? (
            tokensFromAPI.map((token: any, index: number) => (
              <TokenComp
                img={token.tokenImage}
                name={token.token.symbol}
                address={token.tokenAddress}
                key={index}
              />
            ))
          ) : validAddress && searchToken.symbol !== "" ? (
            <NewTokenComp
              symbol={searchToken.symbol}
              address={searchToken.address}
            />
          ) : (
            <Text>Not found</Text>
          )}
        </Flex>
      )}
    </Flex>
  );
};
