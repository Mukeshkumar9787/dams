"use client";

import React from "react";

const LoaderOverlay = ({ message }: { message: string }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/90">
      <div className="flex flex-col items-center gap-3 rounded-lg border border-slate-200 bg-white p-6 shadow-xl">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-solid border-blue border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-600">{message}</p>
      </div>
    </div>
  );
};

export default LoaderOverlay;
