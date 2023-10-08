import { useEffect, useState } from "react";

export const useResizeObserver = (element) => {
  const [dimens, setDimens] = useState();

  useEffect(() => {
    if (element)
      new ResizeObserver(() => {
        setDimens({ h: element.offsetHeight, w: element.offsetWidth });
      }).observe(element);
  }, [element]);

  return dimens;
};
