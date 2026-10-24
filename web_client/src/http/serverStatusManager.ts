import axios from "axios";
import { API_HEALTH } from "./apiUrls";

export type ServerStatus = "idle" | "waking_up" | "online" | "offline";

export interface ServerStatusState {
  status: ServerStatus;
  attempt: number;
  maxAttempts: number;
  elapsedSeconds: number;
  reloadOnWake?: boolean;
}

type Listener = (state: ServerStatusState) => void;

class ServerStatusManager {
  private status: ServerStatus = "idle";
  private attempt = 0;
  private maxAttempts = 35; // 35 * ~2.5s = ~87.5s (ample time for Render cold start)
  private elapsedSeconds = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private elapsedTimer: ReturnType<typeof setInterval> | null = null;
  private listeners = new Set<Listener>();
  private reloadOnWake = false;
  private isLoopRunning = false;

  private pingClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 7000,
    headers: {
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
      "ngrok-skip-browser-warning": "1",
    },
  });

  public getState(): ServerStatusState {
    return {
      status: this.status,
      attempt: this.attempt,
      maxAttempts: this.maxAttempts,
      elapsedSeconds: this.elapsedSeconds,
      reloadOnWake: this.reloadOnWake,
    };
  }

  public isWakingUp(): boolean {
    if (typeof window === "undefined") return false;
    return this.status === "waking_up";
  }

  public isOffline(): boolean {
    if (typeof window === "undefined") return false;
    return this.status === "offline";
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit() {
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error("Error in serverStatus subscriber:", err);
      }
    });
  }

  public async checkHealthNow(): Promise<boolean> {
    try {
      const res = await this.pingClient.get(API_HEALTH);
      if (res.status === 200) {
        this.markOnline();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  public triggerWakeUp(options: { reloadOnWake?: boolean } = {}) {
    if (typeof window === "undefined") return;
    if (this.status === "waking_up") {
      if (options.reloadOnWake) {
        this.reloadOnWake = true;
      }
      return;
    }
    this.startWakeUpLoop(options);
  }

  public startWakeUpLoop(options: { reloadOnWake?: boolean } = {}) {
    if (typeof window === "undefined") return;
    if (this.isLoopRunning) return;

    this.isLoopRunning = true;
    this.status = "waking_up";
    this.attempt = 0;
    this.elapsedSeconds = 0;
    if (options.reloadOnWake !== undefined) {
      this.reloadOnWake = options.reloadOnWake;
    }

    this.emit();
    window.dispatchEvent(
      new CustomEvent("server-waking-up", { detail: this.getState() })
    );

    // Track elapsed seconds
    if (this.elapsedTimer) clearInterval(this.elapsedTimer);
    this.elapsedTimer = setInterval(() => {
      this.elapsedSeconds += 1;
      this.emit();
    }, 1000);

    const ping = async () => {
      this.attempt += 1;
      this.emit();

      try {
        const res = await this.pingClient.get(API_HEALTH);
        if (res.status === 200) {
          this.markOnline();
          return;
        }
      } catch (err) {
        // Still warming up / sleeping on Render
      }

      if (this.attempt >= this.maxAttempts) {
        this.markOffline();
      } else {
        this.timer = setTimeout(ping, 2500);
      }
    };

    // Fire first ping immediately
    ping();
  }

  public markOnline() {
    this.stopTimers();
    this.isLoopRunning = false;
    const wasWakingUp = this.status === "waking_up";
    this.status = "online";
    this.emit();

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("server-connection-success"));

      if (wasWakingUp && this.reloadOnWake) {
        // Give user a brief confirmation before reloading to fetch fresh data
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        // Return to idle after a brief indicator
        setTimeout(() => {
          if (this.status === "online") {
            this.status = "idle";
            this.emit();
          }
        }, 2500);
      }
    }
  }

  public markOffline() {
    this.stopTimers();
    this.isLoopRunning = false;
    this.status = "offline";
    this.emit();

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("server-connection-error", {
          detail: {
            message: "Unable to connect to server after multiple attempts.",
            status: "OFFLINE",
          },
        })
      );
    }
  }

  public manualRetry() {
    this.stopTimers();
    this.isLoopRunning = false;
    this.startWakeUpLoop({ reloadOnWake: true });
  }

  public dismiss() {
    this.stopTimers();
    this.isLoopRunning = false;
    this.status = "idle";
    this.emit();
  }

  private stopTimers() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.elapsedTimer) {
      clearInterval(this.elapsedTimer);
      this.elapsedTimer = null;
    }
  }
}

export const serverStatusManager = new ServerStatusManager();
