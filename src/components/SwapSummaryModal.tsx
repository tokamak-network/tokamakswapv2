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
import straightAightArrow from "../assets/straightAightArrow.png";
import { useActiveWeb3React } from "../hooks/useWeb3";
import { swapAdvance ,getExpectedAdvanced} from "../actions/contractActions";

export const SwapSummaryModal = () => {
  const theme = useTheme();
  const { data } = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();
  const { chainId, account, library } = useActiveWeb3React();
 const [expected, setExpected] = useState<string| undefined>('0')
  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  const pools = data?.data?.pools;
  const amount = data?.data?.amount;
  const slippage = data?.data?.slippage;

  useEffect(() => {
    console.log(slippage);
    
    const getExpected = async() => {
      if (pools && amount) {
        const ttt= await getExpectedAdvanced(library,account,pools,amount,slippage)
        if (ttt) {
          setExpected(ttt.formatted)
        }
       
      }
     
     
    }
    getExpected()
    }, [pools]);
  



  return (
    <Modal
      isOpen={data.modal === "swap_summary" ? true : false}
      onClose={handleCloseModal}
      isCentered
    >
      <ModalOverlay />
      <ModalContent h={"569px"} w={"350px"} ml={"40px"}>
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
            //     border={"1px solid red"}
            flexDir="column"
            justifyContent={"space-between"}
            position="absolute"
          >
            <Flex flexDir="column" pl="21px" position="relative">
              <Flex alignItems="center" mt="10px" mb="18px">
                <Text fontWeight={"bold"} color="#3d495d" fontSize={"20px"}>
                  Swap Summary
                </Text>
                <ModalCloseButton mt="-8px" />
              </Flex>

              <Flex overflow={"scroll"} flexDir="column" h="227px" pb="10px">
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
                      <span style={{ fontWeight: "normal", marginLeft: "2px" }}>
                        ({pool.fee})
                      </span>
                    </Text>
                    {index !== pools.length - 1 && (
                      <Image
                        src={straightAightArrow}
                        w="8px"
                        mt="10.4px"
                        mb="12.4px"
                      />
                    )}
                  </Flex>
                ))}
              </Flex>
            </Flex>
            {pools && (
              <Flex
                h="294px"
                boxShadow={"0 -3px 6px 0 rgba(0, 0, 0, 0.16)"}
                w="100%"
                borderRadius={"10px"}
                position="relative"
                px="21px"
                py="30px"
                flexDir={"column"}
                justifyContent="center"
                alignItems={"center"}
              >
                <Flex flexWrap={"wrap"} color="#3d495d">
                  <Text mr="5px">{pools?.length} total swaps: </Text>
                  {pools?.map((pool: any, index: number) => (
                    <Text key={index}>
                      {pool.token0.name} {" > "}
                    </Text>
                  ))}
                  <Text>{pools[pools?.length - 1].token1.name}</Text>
                </Flex>
                <Flex
                  w="100%"
                  justifyContent={"space-between"}
                  mt="12px"
                  color="#3d495d"
                  fontSize={"14px"}
                >
                  <Text fontWeight="bold">Expected Output</Text>
                  <Text>1,234 LYDA</Text>
                </Flex>
                <Flex
                  w="100%"
                  mt="13px"
                  fontSize={"12px"}
                  justifyContent={"space-between"}
                >
                  <Flex flexDir={"column"} color="#3d495d">
                    <Text> Minimum received after slippage</Text>
                    <Text>(25.0%)</Text>
                  </Flex>
                  <Flex flexDir={"column"} color="#86929d">
                    <Text>{expected}</Text>
                    <Text></Text>
                  </Flex>
                </Flex>
                <Button
                  borderRadius={"28px"}
                  border={"none"}
                  padding={"16px 118px"}
                  mt={"23px"}
                  // cursor={
                  //   !Number(swapFromAmt) || !account || invalidInput ? "not-allowed" : "pointer"
                  // }
                  w={"280px"}
                  backgroundColor={account ? "#007aff" : "#e9edf1"}
                  color={account ? "#fff" : "#8f96a1"}
                  height={"56px"}
                  fontSize={"18px"}
                  fontWeight="normal"
                  _disabled={{
                    backgroundColor: "#e9edf1",
                    color: "#8f96a1",
                  }}
                  _hover={{}}
                  _active={{}}
                  onClick={() => {
                    swapAdvance(library, account, pools, amount, slippage)
                  }}
                >
                  <Text>{"Confirm Swap"}</Text>
                </Button>
              </Flex>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
