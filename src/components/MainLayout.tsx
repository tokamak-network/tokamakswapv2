import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Header } from "./Header";
import { useDisclosure } from "@chakra-ui/react";
import { WalletModal } from "./Wallet";
import { Swapper } from "./Swapper";
import { Footer } from "./Footer";
import { Description } from "./Description";
import TokamakGNB from "./TokamakGNB";
import { ImportTokenModal } from "./ImportTokenModal";
import {AdvanceModeModal} from './AdvanceModeModal'
import {AdvancedSwapper} from './AdvancedSwapper'
import { SwapSummaryModal } from "./SwapSummaryModal";
export const MainLayout = () => {
  const [walletState, setWalletState] = useState<string>("");
  const { onOpen, isOpen: isModalOpen, onClose } = useDisclosure();
  const [advanced, setAdvanced] = useState(true)
  const handleWalletModalOpen = (state: string) => {
    setWalletState(state);
    onOpen();
  };
  
  return(
    
    <Flex flexDir={'column'} justifyContent='space-between' minH='100vh'>
      <TokamakGNB/>
        <Header walletOpen={() => handleWalletModalOpen("wallet")}/>
        {advanced? <AdvancedSwapper setAdvanced={setAdvanced}/>:   <Swapper setAdvanced={setAdvanced}  advanced={advanced}/> }
     
        {/* <Description/> */}
        <Footer/>
        <WalletModal state={walletState} isOpen={isModalOpen} onClose={onClose} />
        <SwapSummaryModal/>
        <ImportTokenModal />
        <AdvanceModeModal/>
       
    </Flex>);
};  
