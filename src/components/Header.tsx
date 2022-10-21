import { FC, useEffect, useRef, useState } from "react";
import { Text, Flex, useTheme, Image, Button, Box } from "@chakra-ui/react";
import { shortenAddress } from "../utils";
import { useActiveWeb3React } from "../hooks/useWeb3";
import Tonswapper from "../assets/TokamakSwapLogo.svg";
import MobileTonswapper from "../assets/TokamakSwapLogoMobile.svg";
import { useAppSelector } from "../hooks/useRedux";
import { selectTxType } from "../store/tx.reducer";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useWindowDimensions } from "../hooks/useWindowDimentions";
import {TokamakSwapLogoMobile} from '../icons/TokamakSwapLogoMobile'
import {TokamakSwapLogo} from '../icons/TokamakSwapLogo'
import { DEFAULT_NETWORK } from "../constants";
type HeaderProps = {
  walletOpen: () => void;
};

export const Header: FC<HeaderProps> = ({ walletOpen }) => {
  const theme = useTheme();
  const { tx } = useAppSelector(selectTxType);
  const { chainId, account, library } = useActiveWeb3React();
  const { width } = useWindowDimensions();
  const [network, setNetwork] = useState('Mainnet')
  console.log('DEFAULT_NETWORK',DEFAULT_NETWORK);
  
useEffect(() => {
  if (chainId !== Number(DEFAULT_NETWORK) && chainId !== undefined) {
    const netType =
      DEFAULT_NETWORK === 1 ? "Mainnet" : "Goerli Test Network";
      setNetwork(netType)
    //@ts-ignore
    // dispatch(fetchUserInfo({reset: true}));
  }
  /*eslint-disable*/
}, [chainId]);
  if (width < 480) {
    return (
      <Flex flexDir={"column"} alignItems={"center"}>
        <Flex
          justifyContent={"space-between"}
          fontFamily={theme.fonts.roboto}
          width={'320px'}
       
          alignItems={'center'}
          pt={"20px"}
         
        >
       <TokamakSwapLogoMobile/>
          {account ? (
            <Button
              border={"solid 1px #dfe4ee"}
              color={theme.colors.gray[225]}
              borderRadius={"18px"}
              w={"151px"}
              h={"36px"}
              pl={"6px"}
              onClick={walletOpen}
              bg={"white.100"}
              _hover={{}}
              cursor={"pointer"}
            >
              <Flex alignItems={"center"}>
                <Box mr={"10px"} mt={"4px"}>
                  <Jazzicon diameter={25} seed={jsNumberForAddress(account)} />
                </Box>
                <Text fontFamily={theme.fonts.titil} fontSize={"14px"}>
                  {shortenAddress(account)}
                </Text>
              </Flex>
            </Button>
          ) : (
            <Button
              w={"136px"}
              h={"36px"}
              p={"6px 20px 7px"}
              borderRadius={"18px"}
              border={"solid 1px #d7d9df"}
              backgroundColor={"#fff"}
              onClick={walletOpen}
            >
              <Text
                fontFamily={theme.fonts.titil}
                fontWeight={600}
                color={"#86929d"}
                fontSize={"15px"}
              >
                Connect Wallet
              </Text>
            </Button>
          )}
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex justifyContent={"space-between"} alignItems={"center"} w='100%' px='7.3%' mt='20px' >
      <Flex width={"350px"}>
       <TokamakSwapLogo />
      </Flex>
      <Flex alignItems={"center"}>
        <Flex
          width={"180px"}
          height={"35px"}
          borderRadius={"18px"}
          border={DEFAULT_NETWORK === chainId? "solid 1px #dfe4ee" : 'solid 1px red'}
          backgroundColor={"#fff"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box
            width={"12px"}
            height={"12px"}
            backgroundColor={chainId === 1 ? "#5ab1ac" :chainId === undefined? "red" : "#2f99f2"}
            borderRadius={"50%"}
            mr={"6px"}
          />
          <Text
            fontSize={"16px"}
            color={"#3e495c"}
            fontFamily={theme.fonts.roboto}
          >
            {chainId === 1 ? "Ethereum Mainnet":chainId === undefined? "Undefined Network" : "Goerli Network"}
          </Text>
        </Flex>
        {account ? (
          <Button
            border={"solid 1px #dfe4ee"}
            color={theme.colors.gray[225]}
            borderRadius={"18px"}
            w={"151px"}
            h={"35px"}
            pl={"6px"}
            onClick={walletOpen}
            bg={"white.100"}
            _hover={{}}
            cursor={"pointer"}
          >
            <Flex alignItems={"center"}>
              <Box mr={"10px"} mt={"4px"}>
                <Jazzicon diameter={25} seed={jsNumberForAddress(account)} />
              </Box>
              <Text fontFamily={theme.fonts.titil} fontSize={"14px"}>
                {shortenAddress(account)}
              </Text>
            </Flex>
          </Button>
        ) : (
          <Button
            w={"136px"}
            h={"35px"}
            p={"6px 20px 7px"}
            borderRadius={"18px"}
            border={"solid 1px #d7d9df"}
            backgroundColor={"#fff"}
            onClick={walletOpen}
          >
            <Text
              fontFamily={theme.fonts.titil}
              fontWeight={600}
              color={"#86929d"}
              fontSize={"15px"}
            >
              Connect Wallet
            </Text>
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
