/**
 * Supported Solana wallet definitions.
 * Each wallet exposes the standard Solana provider interface.
 */
export const WALLETS = [
  {
    id: "phantom",
    name: "Phantom",
    icon: "👻",
    desc: "Most popular Solana wallet",
    url: "https://phantom.app",
    detect: () =>
      typeof window !== "undefined"
        ? window?.phantom?.solana ?? window?.solana
        : null,
  },
  {
    id: "solflare",
    name: "Solflare",
    icon: "🌟",
    desc: "Solana's native DeFi wallet",
    url: "https://solflare.com",
    detect: () =>
      typeof window !== "undefined" ? window?.solflare ?? null : null,
  },
  {
    id: "backpack",
    name: "Backpack",
    icon: "🎒",
    desc: "xNFT wallet by Coral",
    url: "https://backpack.app",
    detect: () =>
      typeof window !== "undefined"
        ? window?.backpack?.solana ?? window?.backpack ?? null
        : null,
  },
];

/**
 * Connect to a Solana wallet provider.
 * @param {object} walletDef - One of WALLETS entries
 * @returns {Promise<{ addr: string, name: string, icon: string }>}
 */
export async function connectWallet(walletDef) {
  const provider = walletDef.detect();

  // Redirect to install page if not detected
  if (!provider) {
    window.open(walletDef.url, "_blank");
    throw new Error(`${walletDef.name} not installed.`);
  }

  let publicKey;
  if (walletDef.id === "phantom") {
    const resp = await provider.connect();
    publicKey = (resp?.publicKey ?? provider?.publicKey)?.toString();
  } else {
    await provider.connect();
    publicKey = provider?.publicKey?.toString();
  }

  if (!publicKey) throw new Error("No public key returned from wallet.");

  return { addr: publicKey, name: walletDef.name, icon: walletDef.icon };
}

/**
 * Disconnect the active wallet provider.
 * @param {object} walletDef
 */
export async function disconnectWallet(walletDef) {
  try {
    const provider = walletDef?.detect?.();
    if (provider?.disconnect) await provider.disconnect();
  } catch {
    // Swallow — disconnecting is best-effort
  }
}

/**
 * Truncate a Solana address for display.
 * @param {string} addr
 * @returns {string}
 */
export const truncAddr = (addr) =>
  addr ? `${addr.slice(0, 4)}…${addr.slice(-4)}` : "";
