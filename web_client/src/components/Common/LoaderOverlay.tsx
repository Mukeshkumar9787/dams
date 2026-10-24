"use client";

import React, { useState, useEffect } from "react";
import { serverStatusManager } from "@/http/serverStatusManager";

const LoaderOverlay = ({ message }: { message: string }) => {
  const [isWakingUp, setIsWakingUp] = useState(() =>
    serverStatusManager.isWakingUp()
  );

  useEffect(() => {
    const unsubscribe = serverStatusManager.subscribe((state) => {
      setIsWakingUp(state.status === "waking_up");
    });
    return unsubscribe;
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 max-w-sm text-center mx-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-sky-500 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-800">
          {isWakingUp ? "Waking up server..." : message}
        </p>
        {isWakingUp && (
          <p className="text-xs text-slate-500 max-w-xs">
            Backend is spinning up on Render. Content will load automatically in a few seconds...
          </p>
        )}
      </div>
    </div>
  );
};

export default LoaderOverlay;
