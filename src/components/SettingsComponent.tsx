import { useState, useEffect } from "react";
import {
  Text,
  Flex,
  Button,
  Image,
  Divider,
  Input,
  IconButton,
  Icon,
  CircularProgress,
  NumberInput,
  NumberInputField,
  Box,
} from "@chakra-ui/react";
import expand from "../assets/expand.png";
import gear from '../assets/gear.png'
import icon_arrow from "../assets/icon_arrow.png";

export const SettingsComponent = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [slippageAmnt, setSlippageAmnt] = useState<string>("0");
  const [invalidInput, setInvalidInput] = useState<boolean>(false);
  return (
    <Flex
      border="1px solid #dfe4ee"
      h={expanded ? "511px" : "36px"}
      borderRadius={"18px"}
      mb="30px"
    
      px="15px"
      alignItems="center"
      flexDir={"column"}
      pt="8px"
      fontFamily={""}
    >
      <Flex justifyContent={"space-between"} w="100%">
        <Text>Settings</Text>
        <Image
          src={gear}
          w="14px"
          h="14px"
          onClick={() => setExpanded(!expanded)}
        />
      </Flex>
      {expanded && (
        <Flex flexDir={"column"} w="100%" mt="11px" textAlign={"left"}>
          <Text fontSize="16px" fontWeight={"bold"} mb="12px">
            Transaction Setting
          </Text>
          <Text fontSize="14px" fontWeight={"normal"} mb="12px">
            Slippage tolerance
          </Text>
          <Flex
            position={"relative"}
            border={invalidInput ? "solid 1px #e53e3e" : "solid 1px #dfe4ee"}
            height={"56px"}
            w={"280px"}
            flexDir={"row"}
            borderRadius={"4px"}
            justifyContent={"space-between"}
            alignItems={"center"}
            pr={"18px"}
            mb="17px"
          >
            <NumberInput
              height={"56px"}
              w={"fit-content"}
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
              value={`${slippageAmnt} %`}
              onChange={(e) => {
                const valueNum = e;
                setSlippageAmnt(valueNum);
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

            <Button
              h="24px"
              w="60px"
              borderRadius={"12px"}
              fontSize="14px"
              fontWeight={"normal"}
              color="#fff"
              bg="#257eee"
            >
              Auto
            </Button>
          </Flex>
          <Text fontSize={"14px"} fontWeight="normal" mb="13px">
            Transaction Deadline
          </Text>
          <Flex
            h="56px"
            w="280px"
            border="1px solid #e7edf3"
            borderRadius={"28px"}
            justifyContent="space-between"
            alignItems={"center"}
            px="24px"
            mb="19.5px"
          >
            <Text>30 minutes</Text>
            <Image src={icon_arrow} h="14px" w="14px" />
          </Flex>
          <Box h={"1px"} bg={"#e9edf1"} w="280px" mt="14.5px"></Box>
          <Text fontSize="16px" fontWeight={"bold"} mt={"15.5px"} mb="20px">
            Auto Router Setting
          </Text>
          <Flex alignItems={"center"} >
            <Flex
              h="20px"
              w="20px"
              bg={"#e9edf1"}
              border={"solid 1px #e7edf3"}
              borderRadius="50%"
            ></Flex>
            <Text fontSize={"12px"} ml="8px" color="#354052">
              70%
            </Text>{" "}
            {/* <Flex
           ml='6px'
              bg={
                "repeating-linear-gradient(to right,red 0,red 3px,transparent 3px,transparent 7px)"
              }
              h="2px"
               w='100%'
            ></Flex> */}
           <svg width="100%" height="35"  viewBox="850 0 300 200" xmlns="http://www.w3.org/2000/svg">
    <line x1="0" x2="3000" y1="100" y2="100" stroke="currentColor" stroke-width="20" stroke-linecap="round" stroke-dasharray="1, 45"/>
</svg>

          </Flex>
        </Flex>
      )}
    </Flex>
  );
};
