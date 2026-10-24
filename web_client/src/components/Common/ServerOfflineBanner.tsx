"use client";

import React, { useState, useEffect } from "react";
import { serverStatusManager, ServerStatusState } from "@/http/serverStatusManager";

const ServerOfflineBanner = () => {
  const [serverState, setServerState] = useState<ServerStatusState>(() =>
    serverStatusManager.getState()
  );
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Initial connectivity probe on first load
    serverStatusManager.checkHealthNow().then((isAwake) => {
      if (!isAwake) {
        // Cold start in progress: start continuous background wake-up pings
        serverStatusManager.startWakeUpLoop({ reloadOnWake: true });
      }
    });

    const unsubscribe = serverStatusManager.subscribe((state) => {
      setServerState(state);
      // If server returns to online or re-triggers wake-up, reset dismissed flag
      if (state.status === "waking_up" || state.status === "online") {
        setIsDismissed(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const { status, attempt, maxAttempts, elapsedSeconds } = serverState;

  if (isDismissed || status === "idle") {
    return null;
  }

  const isWakingUp = status === "waking_up";
  const isOnline = status === "online";
  const isOffline = status === "offline";

  return (
    <div
      className={`sticky top-0 z-[100] w-full px-4 py-3 text-white shadow-lg backdrop-blur-md transition-all duration-300 border-b ${
        isOnline
          ? "bg-emerald-950/95 border-emerald-500/30 text-emerald-100"
          : isWakingUp
          ? "bg-slate-900/95 border-sky-500/30 text-slate-100"
          : "bg-slate-900/95 border-amber-500/30 text-slate-100"
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Animated Indicator Icon */}
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
            {isWakingUp && (
              <>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60"></span>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 border border-sky-400/40">
                  <svg
                    className="h-4 w-4 animate-spin text-sky-400"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                </div>
              </>
            )}

            {isOnline && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/50">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            )}

            {isOffline && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/40">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
            )}
          </div>

          {/* Descriptive Text */}
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold tracking-wide">
                {isWakingUp && "Server is waking up..."}
                {isOnline && "Server is ready!"}
                {isOffline && "Connection is taking longer than usual"}
              </p>
              {isWakingUp && attempt > 0 && (
                <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-medium text-sky-300 border border-sky-400/20">
                  Attempt {attempt}/{maxAttempts} ({elapsedSeconds}s)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300">
              {isWakingUp &&
                "Backend on Render spins down when idle. We're pinging the server continuously to boot it up..."}
              {isOnline &&
                "Backend is awake and responsive. Refreshing latest store content..."}
              {isOffline &&
                "Free instance is still starting up or unreachable. Please try again."}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isOffline && (
            <button
              onClick={() => serverStatusManager.manualRetry()}
              className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-sky-500 transition active:scale-95"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          )}

          {isWakingUp && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-sky-300 font-medium bg-sky-950/60 px-3 py-1 rounded-full border border-sky-800/40">
              <span className="inline-block h-2 w-2 rounded-full bg-sky-400 animate-pulse"></span>
              Auto-retrying in background
            </div>
          )}

          <button
            onClick={() => {
              setIsDismissed(true);
              serverStatusManager.dismiss();
            }}
            className="ml-1 rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white transition"
            title="Dismiss banner"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerOfflineBanner;
