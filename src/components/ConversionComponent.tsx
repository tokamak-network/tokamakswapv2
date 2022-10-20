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
export const ConversionComponent = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <Flex
      w="100%"
      border="1px solid #dfe4ee"
      mt="8px"
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
          <Text>Conversion / Gas</Text>
          <Image
            src={expand}
            w="14px"
            h="14px"
            onClick={() => setExpanded(!expanded)}
          />
        </Flex>
      ) : (
        <Flex h={"191px"} w={"100%"} flexDirection="column">
          <Flex mt="10px" justifyContent={"space-between"} w={"100%"}>
            <Text fontSize={"12px"} color="#3d495d">
              1 TON = 0.0357112 ETH <span>($350.00)</span>
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
              3.57112 ETH
            </Text>
          </Flex>
          <Flex justifyContent={"space-between"} w={"100%"} mt="11px">
            <Text color="#3d495d" fontSize={"14px"} fontWeight="bold">
              Price Impact
            </Text>
            <Text color="#3d495d" fontSize={"14px"} fontWeight="normal">
              0.00%
            </Text>
          </Flex>
          <Box h={"1px"} bg={"#e9edf1"} w="280px" mt="14.5px"></Box>
          <Flex  justifyContent={"space-between"}>
            <Flex flexDir={"column"} alignItems='start' fontSize={'12px'}>
              <Text>Minimum received after slippage</Text>
              <Text>(25.0%)</Text>
            </Flex>
            <Flex flexDir={"column"} fontSize={'12px'} color='#86929d'>
                <Text>3.49</Text>
                <Text>ETH</Text>
            </Flex>
          </Flex>
          <Flex mt='10px' justifyContent={"space-between"} fontSize='12px'>
            <Text color='#3d495d'>Gas Fee</Text>
            <Text color='#86929d'>~$7.63</Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};
