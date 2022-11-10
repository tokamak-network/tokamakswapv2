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
  const id = 'toast'
  useEffect(() => {
    if (currentRequestId !== undefined) {
      setView(true);
    }
  }, [data, currentRequestId]);

  return (
    <>
      {view === true && loading !== "pending"
        ? (
        
          toast(
            //@ts-ignore
            {
              position: "top",
              isClosable: true,
              id,
              render: () => (
                <Flex
                  bg={data.status === 'error'?'#f2c2c2' : "#baeacc"}
                  h={"48px"}
                  w={"320px"}
                  border={data.status === 'error'? "2px solid #e67878":"2px solid #84c3a1"}
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
                    onClick={() => toast.close(id)}
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
