import { useState, useEffect } from "react";
import {
  Text,
  Flex,
  Image,
Link,
  useTheme,
} from "@chakra-ui/react";
import User_guide from '../assets/User_guide.svg'

export const Description = () => {
  const theme = useTheme();
  return (
    <Flex
    w={'100%'}
        justifyContent={"center"}
      mt={"40px"}
      // alignItems="center"
      // margin={"0px auto"}
      mx='auto'
    >
      <Flex ml="-140px" justifyContent={"flex-start"} >
      
        <Link isExternal href='https://tokamaknetwork.gitbook.io/home/02-service-guide/tokamak-network-swap-v2.0' display={'flex'} >
          <Image src={User_guide
          }/>
        <Text
              fontFamily={theme.fonts.roboto}
              fontSize="14px"
              textAlign={"left"}
              color="#8b8b92"
              
              _hover={{
                cursor: "pointer",
              }}
              _focus={{
                cursor: "pointer",
              }}
              ml='5px'
            >
            User Guide
            </Text>
            </Link>
        {/* <Text>Why TON should be Wrapped</Text> */}
      </Flex>
      {/* <Text textAlign={'left'} >What is WTON</Text>  */}
    </Flex>
  );
};
