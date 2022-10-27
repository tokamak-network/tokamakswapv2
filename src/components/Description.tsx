import { useState, useEffect } from "react";
import {
  Text,
  Flex,
Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  useTheme,
} from "@chakra-ui/react";

export const Description = () => {
  const theme = useTheme();
  return (
    <Flex
    w={'100%'}
        justifyContent={"center"}
      mt={"40px"}
      alignItems="center"
      // margin={"0px auto"}
    >
      <Flex ml="-100px" justifyContent={"flex-start"} flexDirection={"column"}>
        <Popover isLazy placement="left-start">
          <PopoverTrigger>
            <Text
              fontFamily={theme.fonts.roboto}
              fontSize="12px"
              textAlign={"left"}
              color="#007aff"
              textDecor={"underline"}
              _hover={{
                cursor: "pointer",
              }}
              _focus={{
                cursor: "pointer",
              }}
            >
              What is WTON?
            </Text>
          </PopoverTrigger>
          <PopoverContent
            bg={"#fff"}
            outline="none"
            _focus={{ outline: "none" }}
            border="1px solid #e7edf3"
          >
            <PopoverCloseButton />
            <PopoverBody>
              <Flex flexDir={"column"}>
                <Text
                  color={"#3d495d"}
                  fontFamily={theme.fonts.roboto}
                  fontSize="18px"
                  fontWeight={"bold"}
                >
                  What is WTON?
                </Text>
                <Text
                  mt={"8px"}
                  color={"#3d495d"}
                  fontFamily={theme.fonts.roboto}
                  fontSize="14px"
                >
                  {" "}
                  WTON is Wrapped TON which enables users to interact with all
                  the contracts in Ethereum. WTON and TON has a 1:1 exchange
                  ratio.
                </Text>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Popover placement="left-start">
          <PopoverTrigger>
            <Text
              fontFamily={theme.fonts.roboto}
              fontSize="12px"
              textAlign={"left"}
              color="#007aff"
              textDecor={"underline"}
              _hover={{
                cursor: "pointer",
              }}
              _focus={{
                cursor: "pointer",
              }}
            >
              Why TON should be Wrapped?
            </Text>
          </PopoverTrigger>
          <PopoverContent
            bg={"#fff"}
            outline="none"
            _focus={{ outline: "none" }}
            border="1px solid #e7edf3"
          >
            <PopoverCloseButton />
            <PopoverBody>
              <Flex flexDir={"column"}>
                <Text
                  color={"#3d495d"}
                  fontFamily={theme.fonts.roboto}
                  fontSize="18px"
                  fontWeight={"bold"}
                >
                  Why TON should be Wrapped?
                </Text>
                <Text
                  mt={"8px"}
                  color={"#3d495d"}
                  fontFamily={theme.fonts.roboto}
                  fontSize="14px"
                >
                  {" "}
                  For the security and stability of TON, certain features were limited on the Ethereum network. To access these features, TON should be wrapped to WTON.

                </Text>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Link isExternal href='https://medium.com/onther-tech/wton-swap-launching-uniswap-listing-ef04267fbac'>
        <Text
              fontFamily={theme.fonts.roboto}
              fontSize="12px"
              textAlign={"left"}
              color="#007aff"
              textDecor={"underline"}
              _hover={{
                cursor: "pointer",
              }}
              _focus={{
                cursor: "pointer",
              }}
            >
              More Info
            </Text>
            </Link>
        {/* <Text>Why TON should be Wrapped</Text> */}
      </Flex>
      {/* <Text textAlign={'left'} >What is WTON</Text>  */}
    </Flex>
  );
};
