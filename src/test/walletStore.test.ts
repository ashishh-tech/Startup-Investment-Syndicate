import { describe, it, expect, beforeEach } from "vitest";
import { useWalletStore } from "@/state/walletStore";

describe("useWalletStore State Machine", () => {
  beforeEach(() => {
    useWalletStore.getState().disconnect();
  });

  it("should initialize in disconnected state", () => {
    const state = useWalletStore.getState();
    expect(state.isConnected).toBe(false);
    expect(state.address).toBeNull();
    expect(state.walletType).toBeNull();
  });

  it("should connect simulator account with funded balance", async () => {
    await useWalletStore.getState().connect("simulator");
    const state = useWalletStore.getState();

    expect(state.isConnected).toBe(true);
    expect(state.walletType).toBe("simulator");
    expect(state.address).toBeDefined();
    expect(state.usdcBalance).toBe("50,000.00");
  });

  it("should switch network cleanly", () => {
    useWalletStore.getState().setNetwork("futurenet");
    expect(useWalletStore.getState().network).toBe("futurenet");

    useWalletStore.getState().setNetwork("testnet");
    expect(useWalletStore.getState().network).toBe("testnet");
  });

  it("should clear session upon disconnect", async () => {
    await useWalletStore.getState().connect("simulator");
    expect(useWalletStore.getState().isConnected).toBe(true);

    useWalletStore.getState().disconnect();
    const state = useWalletStore.getState();
    expect(state.isConnected).toBe(false);
    expect(state.address).toBeNull();
  });
});
