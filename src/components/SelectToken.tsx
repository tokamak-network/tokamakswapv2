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
import icon_arrow from '../assets/icon_arrow.png'
export const SelectToken = () => {
  const [selected, setSelected] = useState("");

  return (
    <Flex
      w={"310px"}
      h={"56px"}
      border={"solid 1px #dfe4ee"}
      borderRadius="28px"
      p="8px"
      alignItems="center"
      
    >
      {selected ? null : (
        <Flex  alignItems="center" justifyContent={'space-between'} w='100%'>
      <Flex alignItems="center">
          <Box w="40px" h="40px" borderRadius={"50%"} bg="#dfe4ee"></Box>
          <Text color={'#3d495d'} fontSize='18px' ml='10px' fontWeight={'normal'}>Select a token</Text>
          </Flex>
          <Image src={icon_arrow} h='14px' w='14px' mr='16px'/>
        </Flex>
      )}
    </Flex>
  );
};
