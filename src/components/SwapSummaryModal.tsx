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

export const SwapSummaryModal = () => {
  const theme = useTheme();
  const { data } = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  const pools = data?.data?.pools;
  const amount = data?.data?.amount;
  console.log(pools);

  return (
    <Modal
      isOpen={data.modal === "swap_summary" ? true : false}
      onClose={handleCloseModal}
      isCentered
    >
      <ModalOverlay />
      <ModalContent h={"569px"} w={"350px"} ml={"40px"}>
        <ModalCloseButton />
        <ModalBody
          borderRadius={"10px"}
          display="flex"
          px="0px"
          //   alignItems="center"
          fontFamily={theme.fonts.roboto}
          flexDir="column"
          color="#707070"
        >
          <Flex
            w="100%"
            h="100%"
            border={"1px solid red"}
            flexDir="column"
            justifyContent={"space-between"}
          >
            <Flex flexDir="column" pl="21px">
              <Text
                fontWeight={"bold"}
                color="#3d495d"
                fontSize={"20px"}
                mb="18px"
              >
                Swap Summary
              </Text>
              <Flex overflow={"scroll"} flexDir="column" h="200px">
                {pools?.map((pool: any, index: number) => (
                  <Flex key={index} flexDir="column" color="#3d495d">
                    <Text fontWeight={"bold"} fontSize={"16px"} mb="9px">
                      {pool.token0.name}
                      {" > "}
                      {pool.token1.name}
                    </Text>
                    {index === 0 && (
                      <Text mb="9px" fontSize={"14px"} fontWeight="bold">
                        Amount:{" "}
                        <span style={{ fontWeight: "normal", fontSize: "" }}>
                          {amount}
                        </span>
                      </Text>
                    )}
                    <Text fontSize={"14px"} fontWeight="bold">
                      Pool Fee:{" "}
                      <span style={{ fontWeight: "normal" }}>
                        {pool.fee / 10000}%
                      </span>
                      <span style={{ fontWeight: "normal" , marginLeft:'2px'}}>
                     ({ pool.fee})
                      </span>
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Flex>

            <Flex
              h="294px"
              boxShadow={"0 -3px 6px 0 rgba(0, 0, 0, 0.16)"}
              w="100%"
              borderRadius={"10px"}
        
            ></Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
