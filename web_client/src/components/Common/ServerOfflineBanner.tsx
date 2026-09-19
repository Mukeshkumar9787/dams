"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/http/axiosInstance";
import { API_CONFIG } from "@/http/apiUrls";

const ServerOfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Perform initial health check to detect connectivity status immediately on page load
    const checkInitialHealth = async () => {
      try {
        const res = await axiosInstance.get(API_CONFIG, { timeout: 3500, skipGlobalLoader: true } as any);
        if (!res || res.data?.isServerUnreachable) {
          setIsOffline(true);
        }
      } catch (err) {
        setIsOffline(true);
      }
    };

    checkInitialHealth();

    const handleServerError = () => {
      setIsOffline(true);
    };

    const handleServerSuccess = () => {
      setIsOffline(false);
      setIsRetrying(false);
    };

    window.addEventListener("server-connection-error", handleServerError);
    window.addEventListener("server-connection-success", handleServerSuccess);

    return () => {
      window.removeEventListener("server-connection-error", handleServerError);
      window.removeEventListener("server-connection-success", handleServerSuccess);
    };
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      const res = await axiosInstance.get(API_CONFIG, { timeout: 4000 });
      if (res.status === 200 || res.data) {
        setIsOffline(false);
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      setIsRetrying(false);
    }
  };

  if (!isOffline) return null;

  return (
    <div className="sticky top-0 z-[100] w-full bg-slate-900/95 px-4 py-3 text-white shadow-lg backdrop-blur-md border-b border-slate-800 transition-all duration-300">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-400">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-slate-100">
              Connection Issue
            </p>
            <p className="text-xs text-slate-300">
              We are unable to connect to our services right now. Please try again later.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white shadow hover:bg-sky-500 transition disabled:opacity-50"
          >
            {isRetrying ? (
              <>
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Checking...
              </>
            ) : (
              "Try Again"
            )}
          </button>

          <button
            onClick={() => setIsOffline(false)}
            className="ml-1 rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerOfflineBanner;
