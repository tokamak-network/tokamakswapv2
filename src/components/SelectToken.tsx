import { useState, useEffect, useRef } from "react";
import { Text, Flex, Image, Input, Box, Button } from "@chakra-ui/react";
import icon_arrow from "../assets/icon_arrow.png";
import TON_symbol from "../assets/TON_symbol.svg";

export const SelectToken = () => {
  const [selected, setSelected] = useState("");
  const wrapperRef = useRef(null);

  const [expanded, setExpanded] = useState<boolean>(true);

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
  const TokenComp = (props: { img: any; name: string }) => {
    const { img, name } = props;
    return (
      <Flex
        h="44px"
        alignItems={"center"}
        zIndex={1000}
        justifyContent="space-between"
      >
        <Flex>
          <Image src={img} h="32px" w="32px" mr="9px" />
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
    <Flex w={"310px"} flexDir="column">
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
          <Image
            src={icon_arrow}
            h="14px"
            w="14px"
            mr="16px"
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
          ref={wrapperRef}
        >
          <Input
            mt="42px"
            borderRadius={"4px"}
            mb="18px"
            placeholder="Search Token or Address"
            border={"solid 1px #dfe4ee"}
          ></Input>
          {tokens.map((token: any, index: number) => (
            <TokenComp img={token.img} name={token.name} />
          ))}
        </Flex>
      )}
    </Flex>
  );
};
