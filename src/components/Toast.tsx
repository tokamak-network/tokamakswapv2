import { useToast, Flex, Text, Icon } from "@chakra-ui/react";
import { useAppSelector } from "../hooks/useRedux";
import { useState, useRef } from "react";
import { useEffect } from "react";
import { selectToast } from "../store/app/toast.reducer";
import { CloseIcon } from "@chakra-ui/icons";
export const Toast = () => {
  const toast = useToast();
  const toastIdRef = useRef();
  const { data, loading, currentRequestId } = useAppSelector(selectToast);
  const [view, setView] = useState(false);
  const id = 'test-toast'

  useEffect(() => {
    if (currentRequestId !== undefined) {
      setView(true);
    }
  }, [data, currentRequestId]);

  return (
    <>
      {view === true && loading !== "pending"
        ?( data.status === 'error'? toast(
            //@ts-ignore
            {
              position: "top",
              isClosable: true,
              id,
              render: () => (
                <Flex
                  bg={"#f2c2c2"}
                  h={"48px"}
                  w={"320px"}
                  border={"1px solid #e67878"}
                  color={"#3d495d"}
                  borderRadius={"10px"}
                  pl="21px"
                  pr={"17px"}
                
                  alignItems={"center"}
                  justifyContent="space-between"
                >
                  <Text>{data.description}</Text>
                  <Icon
                    as={CloseIcon}
                    h={"12px"}
                    w="12px"
                    _hover={{cursor:'pointer'}}
                    onClick={() => toast.close('test-toast')}
                  ></Icon>
                </Flex>
              ),
            }
            // data
          ) 
          : 
          toast(
            //@ts-ignore
            {
              position: "top",
              isClosable: true,
              id,
              render: () => (
                <Flex
                  bg={"#baeacc"}
                  h={"48px"}
                  w={"320px"}
                  border={"1px solid #84c3a1"}
                  color={"#3d495d"}
                  borderRadius={"10px"}
                  pl="21px"
                  pr={"17px"}
                
                  alignItems={"center"}
                  justifyContent="space-between"
                >
                  <Text>{data.description}</Text>
                  <Icon
                    as={CloseIcon}
                    h={"12px"}
                    w="12px"
                    _hover={{cursor:'pointer'}}
                    onClick={() => toast.close('test-toast')}
                  ></Icon>
                </Flex>
              ),
            }
            // data
          )
          && setView(false))
          
        : null}
    </>
  );
};
