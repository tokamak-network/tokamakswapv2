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

export const AdvanceModeModal = () => {
  const theme = useTheme();
  const { data } = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  return (
    <Modal
      isOpen={data.modal === "advance_mode" ? true : false}
      onClose={handleCloseModal}
      isCentered
    >
      <ModalOverlay />
      <ModalContent h={"221px"} w={"310px"}>
        {/* <ModalCloseButton /> */}
        <ModalBody
        borderRadius={'10px'}
          p={"16px 14px 25px 18px"}
          display="flex"
          //   alignItems="center"
          fontFamily={theme.fonts.roboto}
          flexDir="column"
          color="#707070"
        >
          <Flex flexDir={"column"} alignItems="space-between" h="100%">
            <Text
              mb="9px"
              h="28px"
              color="#707070"
              fontSize={"18px"}
              fontWeight="bold"
            >
              Advanced Mode
            </Text>
            <Text fontSize={"14px"}>
              Using Advanced mode can allow high slippage trades that may result in
              loss of funds. Use this mode only if you know what you are doing.
            </Text>
          </Flex>
          <Button
            minH="34px"
            bg="#257eee"
            color="#fff"
            borderRadius={"17px"}
            fontWeight="normal"
            fontSize={"14px"}
            _hover={{}}
           _active={{}}
           onClick={() =>{ data?.data?.setAdvanced(true)
            handleCloseModal()}}
          >
            Start Advanced Mode
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
