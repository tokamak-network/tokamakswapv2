import { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  Text,
  Flex,
  Button,
  Image,
  Switch,
  Divider,
  Input,
  IconButton,
  Icon,
  CircularProgress,
  NumberInput,
  NumberInputField,
  Tooltip,
  Box,
} from "@chakra-ui/react";
import gear from "../assets/gear.png";
import icon_arrow from "../assets/icon_arrow.png";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { useAppDispatch } from "../hooks/useRedux";
import { openModal } from "../store/modal.reducer";

export const SettingsComponent = (props: {
  setSlippage: Dispatch<SetStateAction<any>>;
  focused: string;
  setAdvanced?: Dispatch<SetStateAction<any>>;
  advanced: boolean;
}) => {
  const { setSlippage, focused, setAdvanced, advanced } = props;
  const [expanded, setExpanded] = useState<boolean>(false);
  const [slippageAmnt, setSlippageAmnt] = useState<string>("0");
  const [invalidInput, setInvalidInput] = useState<boolean>(false);
  const [isLabelOpen, setIsLabelOpen] = useState(false)

  const dispatch = useAppDispatch();

  useEffect(() => {
    setSlippageAmnt(focused === "input1" ? "1" : "3");
  }, [focused]);
  return (
    <Flex
      border="1px solid #dfe4ee"
      h={expanded ? (advanced ? "172px" : "232px") : "36px"}
      borderRadius={"18px"}
      mb={advanced ? "12px" : "30px"}
      px="15px"
      flexDir={"column"}
      fontFamily={""}
      w="310px"
    >
      <Flex
        justifyContent={"space-between"}
        mt="8px"
        w="280px"
        h="19px"
        alignItems={"center"}
      >
        <Text fontSize={"14px"}>Settings</Text>
        <Image
          src={gear}
          w="14px"
          h="14px"
          onClick={() => setExpanded(!expanded)}
        />
      </Flex>
      {expanded && (
        <Flex flexDir={"column"} w="310px" mt="11px" textAlign={"left"}>
          <Text fontSize="16px" fontWeight={"bold"} mb="12px" h="21px">
            Transaction Settings
          </Text>
          <Text fontSize="14px" fontWeight={"normal"} mb="12px" h="19px">
            Slippage tolerance
          </Text>
          <Flex
            position={"relative"}
            border={invalidInput ? "solid 1px #e53e3e" : "solid 1px #dfe4ee"}
            height={"56px"}
            w={"280px"}
            flexDir={"row"}
            borderRadius={"4px"}
            justifyContent={"space-between"}
            alignItems={"center"}
            pr={"18px"}
            mb="19.5px"
          >
            <NumberInput
              height={"56px"}
              w={"fit-content"}
              color={"#86929d"}
              pl={"24px"}
              border={"none"}
              fontSize={"18px"}
              borderRadius={"4px"}
              borderColor={"transparent"}
              _focus={{
                borderColor: "transparent",
              }}
              _active={{
                borderColor: "transparent",
              }}
              focusBorderColor="transparent"
              _hover={{
                borderColor: "transparent",
              }}
              defaultValue={0}
              value={`${slippageAmnt} %`}
              onChange={(e) => {
                const valueNum = e;
                setSlippageAmnt(valueNum);
                setSlippage(valueNum);
              }}
            >
              <NumberInputField
                border={"none"}
                height={"56px"}
                outline={"none"}
                borderColor={"transparent"}
                pl={"0px"}
              />
            </NumberInput>

            {/* <Button
              h="24px"
              w="60px"
              borderRadius={"12px"}
              fontSize="14px"
              fontWeight={"normal"}
              color="#fff"
              bg="#257eee"
              onClick={()=> {setSlippage(focused === 'input1'? '1' : '5')
              setSlippageAmnt(focused === 'input1'? '1' : '5')}}
            >
              Auto
            </Button> */}
          </Flex>
          {/* <Text fontSize={"14px"} fontWeight="normal" mb="13px" h='19px'>
            Transaction Deadline
          </Text>
          <Flex
            h="56px"
            w="280px"
            border="1px solid #e7edf3"
            borderRadius={"28px"}
            justifyContent="space-between"
            alignItems={"center"}
            px="24px"
            mb="19.5px"
          >
            <Text>30 minutes</Text>
            <Image src={icon_arrow} h="14px" w="14px" />
          </Flex> */}
          {!advanced && <Box h={"1px"} bg={"#e9edf1"} w="280px"></Box>}
          {!advanced && (
            <Flex
              mt="15.5px"
              h="21px"
              alignItems={"center"}
              width="100%"
              justifyContent={"space-between"}
              mb="17px"
              w={"280px"}
            >
              <Flex alignItems={"center"}>
                <Text fontSize={"16px"} fontWeight="bold">
                  Advanced Mode
                </Text>
                <Tooltip
                  label="Advanced mode is a mode provided for those who want to swap, which is not provided by our TONSwapper service.
Users must know the swap path to use this service and enter each address and fee.
Advanced mode allows for high slippage trades.
Use this mode only if you know what you are doing."
                  bg="#ffffff"
                  color={"3d495d"}
                  border={'2px solid #257eee'}
                  placement='top'
                  isOpen={isLabelOpen}
                 
                >
                  <QuestionOutlineIcon ml="9px"  onMouseEnter={()=>setIsLabelOpen(true)}
                  onMouseLeave={()=>setIsLabelOpen(false)} onClick={() => setIsLabelOpen(!isLabelOpen)} />
                </Tooltip>
              </Flex>
              <Switch
                onChange={() => {
                  dispatch(
                    openModal({
                      type: "advance_mode",
                      data: { setAdvanced },
                    })
                  );
                }}
              />
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  );
};
