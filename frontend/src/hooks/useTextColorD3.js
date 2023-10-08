import { useEffect, useRef } from "react";

import * as d3 from "d3";
import { useColorMode } from "@chakra-ui/react";

export const useTextColorD3 = () => {
  const { colorMode } = useColorMode();

  const once = useRef(false);

  useEffect(() => {
    if (once.current) return;

    const t = setTimeout(() => {
      d3.selectAll("text").style(
        "fill",
        colorMode === "light" ? "black" : "white"
      );
      once.current = true;
    }, 1000);

    return () => clearTimeout(t);
  }, [colorMode]);

  useEffect(() => {
    d3.selectAll("text").style(
      "fill",
      colorMode === "light" ? "black" : "white"
    );
  }, [colorMode]);
};
