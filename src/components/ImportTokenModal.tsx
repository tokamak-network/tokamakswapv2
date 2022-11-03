import { useCallback, useEffect, useState, FC } from "react";
import {
  Flex,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useTheme,
  Image,
  Avatar,
} from "@chakra-ui/react";
import { closeModal, selectModalType, openModal } from "../store/modal.reducer";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import ETH_symbol from "../assets/ETH_symbol.png";
import * as TONABI from "../services/abis/TON.json";
import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import { getSigner } from "../utils/contract";

export const ImportTokenModal = () => {
  const theme = useTheme();
  const { data } = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();
  const { account, library } = useWeb3React();
  const [symbol, setSymbol] = useState<string>("");
  const [decimal, setDecimal] = useState<number>(0);
  const [name, setName] = useState("");
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  const address = data.data.tokenAddress;

  useEffect(() => {
    async function getToken() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      if (data.data.address === ZERO_ADDRESS) {
        setDecimal(18);
        setSymbol("ETH");
      } else {
        const signer = getSigner(library, account);        
        try {
          const contract = new Contract(address, TONABI.abi, library);
          const symbolContract = await contract.symbol();
          const decimalContract = await contract.decimals();
          const nameContract = await contract.name();
          setDecimal(decimalContract);
          setSymbol(symbolContract);
          setName(nameContract);
        } catch (err) {}
      }
    }
    getToken();
  }, [data, account, library]);
  return (
    <Modal
      isOpen={data.modal === "import_tokens" ? true : false}
      onClose={handleCloseModal}
      isCentered
    >
      <ModalOverlay />
      <ModalContent h={"515px"} w={"320px"}>
        <ModalCloseButton />
        <ModalBody
          px="24px"
          pb={"40px"}
          pt={"33px"}
          display="flex"
          alignItems="center"
          fontFamily={theme.fonts.roboto}
          flexDir="column"
        >
          <Text fontWeight={"bold"} fontSize={"18px"} lineHeight={"normal"}>
            IMPORT TOKEN
          </Text>
          <Text
            mx="25px"
            textAlign={"center"}
            mt={"44px"}
            fontSize={"16px"}
            lineHeight={"normal"}
          >
            This Token doesn’t appear on TONSwapper, would you like to import
            it?
          </Text>
          <Avatar
            mt={"45px"}
            name={name}
            h={"52px"}
            w={"52px"}
            borderRadius={"50%"}
          />
          <Text
            mt={"8px"}
            fontSize={"18px"}
            fontWeight={"bold"}
            lineHeight={"normal"}
          >
            {symbol}
          </Text>
          <Text mt={"4px"} fontSize={"14px"} fontWeight={"normal"}>
            {name}
          </Text>
          <Text
            mt={"8px"}
            wordBreak={"break-all"}
            fontSize={"14px"}
            color={"#257eee"}
          >
            {address}
          </Text>
          <Button
            mt={"58px"}
            h={"56px"}
            w={"280px"}
            bg={"#257eee"}
            color={"#fff"}
            borderRadius={"28px"}
            onClick={() => {
              data?.data?.setToken({name:name,address:address, img:''});
              data?.data?.setSearchString('');
              data?.data?.setSelected({name:name, img:''})
              handleCloseModal()
            }}
          >
            Import
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
