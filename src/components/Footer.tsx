import {
  Box,
  Container,
  Flex,
  Link,
  Text,
  useTheme,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
// import emailIcon from 'assets/svgs/email.svg';
import { IconTelegram } from "../icons/IconTelegram";
import { IconGithub } from "../icons/IconGithub";
import { IconMedium } from "../icons/IconMedium";
import { IconTwitter } from "../icons/IconTwitter";
import { IconDiscord } from "../icons/IconDiscord";
import { IconFacebook } from "../icons/IconFacebook";
import { IconYoutube } from "../icons/IconYoutube";
import { IconInstagram } from "../icons/IconInstagram";

import DAO from "../assets/DAO.svg";
import swap from "../assets/swap.svg";
import tokamak from "../assets/tokamak1.svg";
import { useState } from "react";
import { useWindowDimensions } from "../hooks/useWindowDimentions";

import { EmailIcon, ChevronUpIcon } from "@chakra-ui/icons";
const socialLinks = [
  {
    title: "Telegram",
    icon: IconTelegram,
    href: "https://t.me/tokamak_network",
    isExternal: true,
  },
  {
    title: "Discord",
    icon: IconDiscord,
    href: "https://discord.gg/6wJ8HAA2nD",
    isExternal: true,
  },
  {
    title: "GitHub",
    icon: IconGithub,
    href: "https://github.com/Onther-Tech/tonswapper",
    isExternal: true,
  },
  {
    title: "Facebook",
    icon: IconFacebook,
    href: "https://www.facebook.com/OntherInc",
    isExternal: true,
  },
  {
    title: "Instagram",
    icon: IconInstagram,
    href: "https://www.instagram.com/onther_official/",
    isExternal: true,
  },
  {
    title: "Youtube",
    icon: IconYoutube,
    href: "https://www.youtube.com/c/%EC%98%A8%EB%8D%94%EC%9B%94%EB%93%9C",
    isExternal: true,
  },
  {
    title: "Twitter",
    icon: IconTwitter,
    href: "https://twitter.com/tokamak_network",
    isExternal: true,
  },
  {
    title: "Medium",
    icon: IconMedium,
    href: "https://medium.com/onther-tech/https-medium-com-onther-tech-tos/home",
    isExternal: true,
  },
  // {
  //   title: 'Youtube',
  //   icon: YoutubeIcon,
  //   href: 'https://www.youtube.com/channel/UCF6vtIKF_0QQVRG983czVEQ/',
  //   isExternal: true,
  // },
];

const dropdownItems = [
  {
    name: "Tokamak Network",
    url: "https://tokamak.network/#/",
    id: 0,
  },
  {
    name: "Original Staking",
    url: "https://staking.tokamak.network/",
    id: 1,
  },
  {
    name: "Simple Staking",
    url: "https://simple.staking.tokamak.network/",
    id: 2,
  },
  {
    name: "Staking Simulator",
    url: "https://staking-simulator.tokamak.network/",
    id: 3,
  },
  {
    name: "Price Dashboard",
    url: "https://price.tokamak.network/#/",
    id: 4,
  },
  {
    name: "Vesting Dashboard",
    url: "https://vesting.tokamak.network/#/",
    id: 5,
  },
  {
    name: "Developer Guide",
    url: "https://docs.tokamak.network/",
    id: 6,
  },
];

const mobileLinkItems = [
  {
    name: "Tokamak",
    url: "https://tokamak.network/#/",
    isExternal: true,
    icon: tokamak,
  },
  {
    name: "DAO",
    url: "https://dao.tokamak.network/#/",
    isExternal: true,
    icon: DAO,
  },
  {
    name: "Swap",
    url: "https://swap.tokamak.network/",
    isExternal: true,
    icon: swap,
  },
];
const SocialLinks = () => {
  return (
    <Flex direction={"row"} mr={3}>
      {socialLinks.map((socialLink: any, index: number) => (
        <Link
          href={socialLink.href}
          isExternal={socialLink.isExternal}
          mr={"20px"}
          key={index}
        >
          <socialLink.icon />
        </Link>
      ))}
    </Flex>
  );
};

const MobileSocialLinks = () => {
  return (
    <Flex direction={"row"} mr={3} justifyContent={"space-between"} w={"320px"}>
      {socialLinks.map((socialLink: any, index: number) => (
        <Link
          href={socialLink.href}
          isExternal={socialLink.isExternal}
          mr={"20px"}
          key={index}
        >
          <socialLink.icon />
        </Link>
      ))}
    </Flex>
  );
};

const MobileLinks = () => {
  const theme = useTheme();
  return (
    <Flex direction={"row"} mr={4} mt={"12px"}>
      {mobileLinkItems.map((mobileLinkItem: any, index: number) => (
        <Flex flexDir={"column"} alignItems={"center"} mr={"9px"} w={"60px"}>
          <Link
            w={"60px"}
            h={"60px"}
            bg={"#ffffff"}
            display={"flex"}
            href={mobileLinkItem.url}
            key={index}
            borderRadius={"5px"}
            justifyContent={"center"}
            alignItems={"center"}
            _hover={{ border: "1px solid #2a72e5" }}
          >
            <Image src={mobileLinkItem.icon} />
          </Link>
          <Text
            fontFamily={theme.fonts.roboto}
            fontWeight={500}
            textAlign={"center"}
            w={"60px"}
            mt={"4px"}
            fontSize={"14px"}
          >
            {mobileLinkItem.name}
          </Text>
        </Flex>
      ))}
    </Flex>
    // <Flex direction={"row"}>
    //   {mobileLinkItems.map((item: any, index: number) => {
    //     <Link key={index}>
    //       <Text>{item.name}</Text>
    //     </Link>;
    //   })}
    // </Flex>
  );
};
export const Footer = () => {
  const theme = useTheme();
  const [selectedMenuItem, setSelectedMenuItem] =
    useState<string>("Family Site");

  const bgColor = "gray.50";

  const { width } = useWindowDimensions();

 if (width < 740) {
    return (
      <Flex
        maxW={"full"}
        mt={"50px"}
        // w={"316px"}
        h={"100%"}
        mb={"200px"}
        p={"0px"}
        justifyContent='center'
      >
        <Flex flexDir={"column"} h={"21px"}>
          <Flex
            flexDir={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Text
              color={"gray.225"}
              fontWeight={600}
              fontSize={14}
              //   fontFamily={theme.fonts.body}
              letterSpacing={"normal"}
            >
              ONTHER PTE.LTD
            </Text>
            <Flex alignItems={"center"}>
              <Box mr={"4px"}>
                <EmailIcon color={"#84919e"}></EmailIcon>
              </Box>
              <Text
                color={"gray.250"}
                fontSize={13}
                //   fontFamily={theme.fonts.body}
                fontWeight={"normal"}
              >
                hello@tokamak.network
              </Text>
            </Flex>
          </Flex>
          <Flex mt={"5px"} justifyContent={"center"}>
            <Text
              color={"gray.175"}
              fontSize={13}
              //   fontFamily={theme.fonts.body}
              fontWeight={"normal"}
            >
              111 SOMERSET ROAD #06-07O 111 SOMERSET SINGAPORE 238164
            </Text>
          </Flex>
          <Flex justifyContent={"center"} mt={"20px"}>
            {" "}
            <MobileSocialLinks />
          </Flex>
          <Flex>
            <MobileLinks />
          </Flex>
        </Flex>
      </Flex>
    );
  }

  else if ( width > 740 && width < 1270) {
    return (
      <Flex
      maxW={"full"}
      w={"100%"}
      h={"100%"}
      p={"0px"}
      mt='49px'
    >
      <Flex flexDir={"column"} mx='20px'  w={"100%"} >
        <Flex
         maxW={"100%"}
          flexDir={"row"}
          // alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text
            color={"gray.225"}
            fontWeight={600}
            fontSize={14}
            //   fontFamily={theme.fonts.body}
            letterSpacing={"normal"}
          >
            ONTHER PTE.LTD
          </Text>
          <Text
            color={"gray.175"}
            fontSize={13}
            //   fontFamily={theme.fonts.body}
            fontWeight={"normal"}
          >
            111 SOMERSET ROAD #06-07O 111 SOMERSET SINGAPORE 238164
          </Text>
         
        </Flex>
        <Flex mt={"5px"} justifyContent={"center"} mb='10px'   maxW={"100%"}>
        <Flex justifyContent={"center"} w={"100%"} alignItems='center'>
            <Box mr={"4px"}>
              <EmailIcon color={"#84919e"}></EmailIcon>
            </Box>
            <Text
              color={"gray.250"}
              fontSize={13}
              mr={'30px'}
              //   fontFamily={theme.fonts.body}
              fontWeight={"normal"}
            >
              hello@tokamak.network
            </Text>
            <MobileSocialLinks />
            <Menu isLazy>
              <MenuButton
                border={"1px solid #dfe4ee"}
                padding={"10px"}
                borderRadius={"2px"}
                h={"30px"}
                color={"#3e495c"}
                fontSize={"12px"}
                w={"190px"}
              >
                <Text
                  w={"100%"}
                  display={"flex"}
                  flexDir={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  {selectedMenuItem}
                  <span>
                    <ChevronUpIcon />
                  </span>
                </Text>
              </MenuButton>
              <MenuList m={"0px"} minWidth="190px" background={"#ffffff"}>
                {dropdownItems.map((item: any, index) => (
                  <Link href={item.url} isExternal={true} key={index}>
                    <MenuItem
                      h={"30px"}
                      color={"#3e495c"}
                      fontSize={"12px"}
                      w={"190px"}
                      m={"0px"}
                      value={item.id}
                      _hover={{ background: "transparent", color: "blue.100" }}
                      _focus={{ background: "transparent" }}
                      key={index}
                    >
                      {item.name}
                    </MenuItem>
                  </Link>
                ))}
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      
      </Flex>
    </Flex>
    )
  }
  return (
      <Flex
        flexDirection={{ base: "column", md: "row" }}
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
        mt='49px'
        px='40px'
    //  bottom={'0px'}
    //  position='relative'
    //  mt='46px'
      >
        <Flex
          flexGrow={2}
          h={'76px'}
          direction={{ base: "column", md: "row" }}
          alignItems={"center"}
        >
          <Box mr={"25px"}>
            <Text
              color={"gray.225"}
              fontWeight={600}
              fontSize={14}
              //   fontFamily={theme.fonts.body}
              letterSpacing={"normal"}
            >
              ONTHER PTE.LTD
            </Text>
          </Box>
          <Box mr={"25px"} py={{ base: 4, md: 0 }}>
            <Text
              color={"gray.175"}
              fontSize={13}
              //   fontFamily={theme.fonts.body}
              fontWeight={"normal"}
            >
              111 SOMERSET ROAD #06-07O 111 SOMERSET SINGAPORE 238164
            </Text>
          </Box>
          <Box mr={{ base: 0, md: 3 }}>
            <EmailIcon color={"#84919e"}></EmailIcon>
          </Box>
          <Box justifyContent={"center"} alignItems={"center"}>
            <Text
              color={"gray.250"}
              fontSize={13}
              //   fontFamily={theme.fonts.body}
              fontWeight={"normal"}
            >
              hello@tokamak.network
            </Text>
          </Box>
        </Flex>
        <Box maxW={"full"}>
          <Flex
            py={{ base: 4, md: 0 }}
            grow={2}
            direction={{ base: "column", lg: "row" }}
            justifyContent={"flex-end"}
            alignItems={"center"}
          >
            <SocialLinks />
            <Menu isLazy>
              <MenuButton
                border={"1px solid #dfe4ee"}
                padding={"10px"}
                borderRadius={"2px"}
                h={"30px"}
                color={"#3e495c"}
                fontSize={"12px"}
                w={"190px"}
              >
                <Text
                  w={"100%"}
                  display={"flex"}
                  flexDir={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  {selectedMenuItem}
                  <span>
                    <ChevronUpIcon />
                  </span>
                </Text>
              </MenuButton>
              <MenuList m={"0px"} minWidth="190px" background={"#ffffff"}>
                {dropdownItems.map((item: any, index) => (
                  <Link href={item.url} isExternal={true} key={index}>
                    <MenuItem
                      h={"30px"}
                      color={"#3e495c"}
                      fontSize={"12px"}
                      w={"190px"}
                      m={"0px"}
                      value={item.id}
                      _hover={{ background: "transparent", color: "blue.100" }}
                      _focus={{ background: "transparent" }}
                      key={index}
                    >
                      {item.name}
                    </MenuItem>
                  </Link>
                ))}
              </MenuList>
            </Menu>
          </Flex>
        </Box>
      </Flex>
  );
};
