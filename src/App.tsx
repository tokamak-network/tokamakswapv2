import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Logo } from "./Logo";
import { MainLayout } from "./components/MainLayout";
import { Provider } from "react-redux";
import store from "./store";
export const App = () => (
  
  <Box textAlign="center" w={'100%'} >
    <MainLayout />
  </Box>
);
