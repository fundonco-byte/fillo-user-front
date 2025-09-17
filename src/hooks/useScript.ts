"use client";

import { useEffect } from "react";

const useScript = (src: string, onLoad?: () => void) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;

    if (onLoad) {
      script.onload = onLoad;
    }

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [src, onLoad]);
};

export default useScript;
