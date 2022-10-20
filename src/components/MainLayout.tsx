import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Header } from "./Header";
import { useDisclosure } from "@chakra-ui/react";
import { WalletModal } from "./Wallet";
import { Swapper } from "./Swapper";
export const MainLayout = () => {
  const [walletState, setWalletState] = useState<string>("");
  const { onOpen, isOpen: isModalOpen, onClose } = useDisclosure();

  const handleWalletModalOpen = (state: string) => {
    setWalletState(state);
    onOpen();
  };
  return(
    
    <Flex flexDir={'column'}>
        <Header walletOpen={() => handleWalletModalOpen("wallet")}/>
        <Swapper/>
        <WalletModal state={walletState} isOpen={isModalOpen} onClose={onClose} />
    </Flex>);
};
