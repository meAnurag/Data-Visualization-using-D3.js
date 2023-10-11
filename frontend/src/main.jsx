import React from "react";
import ReactDOM from "react-dom/client";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";

import App from "./App.jsx";
import Nav from "./components/Nav.jsx";

import "./index.css";
import theme from "./utils/theme.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <Nav />
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
