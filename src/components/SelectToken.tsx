import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Text, Flex, Image, Input, Box, Button } from "@chakra-ui/react";
import icon_arrow from "../assets/icon_arrow.png";
import TON_symbol from "../assets/TON_symbol.svg";
import getTokensData from "../actions/fetch";
import ETH_symbol from '../assets/ETH_symbol.png'

export const SelectToken = (props: {setToken:Dispatch<SetStateAction<any>>}) => {
const {setToken} = props;
  const [selected, setSelected] = useState({ name: "", img: "" });
  const wrapperRef = useRef(null);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [tokensFromAPI, setTokensFromAPI] = useState<any>([]);

  useEffect(() => {
    async function getTokens() {
      const tokens = await getTokensData();
      console.log(tokens);
      
      setTokensFromAPI(tokens);
    }
    getTokens();
  }, []);

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
  const tokens = [
    { img: TON_symbol, name: "TON" },
    { img: TON_symbol, name: "TON" },
    { img: TON_symbol, name: "TON" },
    { img: TON_symbol, name: "TON" },
    { img: TON_symbol, name: "TON" },
    { img: TON_symbol, name: "TON" },
    { img: TON_symbol, name: "TON" },
    { img: TON_symbol, name: "TON" },
    { img: TON_symbol, name: "TON" },
    { img: TON_symbol, name: "TON" },
    { img: TON_symbol, name: "TON" },
    { img: TON_symbol, name: "TON" },
  ];

  const TokenComp = (props: {
    img: any;
    name: string;
    address:string
  }) => {
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
          setToken(address)
        }}
        _hover={{cursor:'pointer'}}
      >
        <Flex>
          <Image src={img !== undefined? img:ETH_symbol} h="32px" w="32px" mr="9px" borderRadius={'50%'}/>
          <Text>{name}</Text>
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
        zIndex={expanded ? 1000 : 0}
      >
        <Flex alignItems="center" justifyContent={"space-between"} w="100%">
          {selected.name === "" ? (
            <Flex alignItems="center">
              <Box w="40px" h="40px" borderRadius={"50%"} bg="#dfe4ee" ></Box>
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
            <Flex alignItems="center" >
            <Image w="40px" h="40px" borderRadius={"50%"} src={selected.img} ></Image>
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

          <Image
            src={icon_arrow}
            h="14px"
            w="14px"
            mr="16px"
            _hover={{cursor:'pointer'}}
            onClick={() => setExpanded(!expanded)}
          />
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
        >
          <Input
            mt="42px"
            borderRadius={"4px"}
            mb="18px"
            placeholder="Search Token or Address"
            border={"solid 1px #dfe4ee"}
          ></Input>
          {tokensFromAPI.map((token: any, index: number) => (
            <TokenComp
              img={token.tokenImage}
              name={token.token.symbol}
              address={token.tokenAddress}
              key={index}

              
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
};
