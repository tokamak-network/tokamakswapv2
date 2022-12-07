import { useState, useEffect } from "react";
import {
  Text,
  Flex,
  useColorMode,
  useTheme,
  Checkbox,
  Grid,
  GridItem,
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
export const ConversionComponent = (props: {
  expectedAmnt: string;
  symbol1: string;
  symbol0: string;
  slippage: string;
  minAmount: string;
  focused: string;
  swapFromAmt2:string
}) => {
  const { expectedAmnt, symbol1, symbol0, slippage, minAmount ,focused,swapFromAmt2} = props;
  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <Flex
      w="100%"
      border="1px solid #dfe4ee"
      borderRadius={"18px"}
      px="15px"
      mb="8px"
    >
      {!expanded ? (
        <Flex
          h="36px"
          justifyContent={"space-between"}
          alignItems="center"
          w="100%"
        >
          <Text fontSize={"14px"}>Conversion</Text>
          <Image
            src={expand}
            w="14px"
            h="14px"
            onClick={() => setExpanded(!expanded)}
          />
        </Flex>
      ) : (
        <Flex h={"145px"} w={"100%"} flexDirection="column">
          <Flex mt="10px" justifyContent={"space-between"} w={"100%"}>
            <Text fontSize={"14px"} color="#3d495d">
              Conversion
            </Text>
            <Image
              src={expand}
              w="14px"
              h="14px"
              onClick={() => setExpanded(!expanded)}
            />
          </Flex>
          <Flex justifyContent={"space-between"} w={"100%"} mt="16px">
            <Text color="#3d495d" fontSize={"14px"} fontWeight="bold">
              Expected Output
            </Text>
            <Text color="#3d495d" fontSize={"14px"} fontWeight="normal">
              {focused === 'input1'? `${minAmount} ${symbol1}`: `${swapFromAmt2}${symbol1}`}
            </Text>
          </Flex>
          <Box
            h={"1px"}
            bg={"#e9edf1"}
            w="280px"
            mt="14.5px"
            mb={"12.5px"}
          ></Box>
          <Flex justifyContent={"space-between"}>
            <Flex flexDir={"column"} alignItems="start" fontSize={"12px"}>
              <Text>{focused === 'input1'? 'Minimum received after slippage':'Maximum spent after slippage'}</Text>
              <Text>{symbol1 === 'WTON' && symbol0 === 'TON' || symbol1 === 'TON' && symbol0 === 'WTON' ? `0%`: slippage ? `${slippage} %` :focused === 'input1'?  `1%`: `3%`}</Text>
            </Flex>
            <Flex flexDir={"column"} fontSize={"12px"} color="#86929d">
              <Text>{minAmount ? expectedAmnt : `0`}</Text>
              <Text>{symbol1}</Text>
            </Flex>
          </Flex>
          {/* <Flex mt='10px' justifyContent={"space-between"} fontSize='12px'>
            <Text color='#3d495d'>Gas Fee</Text>
            <Text color='#86929d'>~$7.63</Text>
          </Flex> */}
        </Flex>
      )}
    </Flex>
  );
};
