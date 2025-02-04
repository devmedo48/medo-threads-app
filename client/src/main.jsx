/* eslint-disable react-hooks/rules-of-hooks */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  useColorModeValue,
} from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import SocketContextProvider from "./context/SocketContext.jsx";

const styles = {
  global: (props) => ({
    "::-webkit-scrollbar-track": {
      bg: useColorModeValue("gray.light", "gray.dark"),
    },
    "::-webkit-scrollbar-thumb": {
      bg: useColorModeValue("gray.dark", "gray.light"),
      rounded: "full",
    },
    "::-webkit-scrollbar-thumb:hover": {
      bg: "gray.700",
    },
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("gray.100", "#101010")(props),
    },
    ".loading": {
      bg: mode("gray.100", "#101010")(props),
    },
  }),
};
const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};
const colors = {
  gray: {
    light: "#616161",
    dark: "#1e1e1e",
  },
};
const theme = extendTheme({ config, styles, colors });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <RecoilRoot>
          <SocketContextProvider>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <App />
          </SocketContextProvider>
        </RecoilRoot>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>
);
