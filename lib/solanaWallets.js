export var SOLANA_WALLETS = [
  {
    id: "phantom",
    name: "Phantom",
    icon: "👻",
    desc: "Most popular Solana wallet",
    detect: function() {
      return typeof window !== "undefined"
        ? (window.phantom && window.phantom.solana) || window.solana
        : null;
    },
    url: "https://phantom.app",
  },
  {
    id: "solflare",
    name: "Solflare",
    icon: "🌟",
    desc: "Solana native DeFi wallet",
    detect: function() {
      return typeof window !== "undefined" ? window.solflare : null;
    },
    url: "https://solflare.com",
  },
  {
    id: "backpack",
    name: "Backpack",
    icon: "🎒",
    desc: "xNFT wallet by Coral",
    detect: function() {
      return typeof window !== "undefined"
        ? (window.backpack && window.backpack.solana) || window.backpack
        : null;
    },
    url: "https://backpack.app",
  },
];

export async function connectSolanaWallet(walletDef) {
  var provider = walletDef.detect();
  if (!provider) {
    window.open(walletDef.url, "_blank");
    throw new Error(walletDef.name + " not installed.");
  }
  var publicKey;
  if (walletDef.id === "phantom") {
    var resp = await provider.connect();
    publicKey =
      (resp && resp.publicKey && resp.publicKey.toString()) ||
      (provider.publicKey && provider.publicKey.toString());
  } else {
    await provider.connect();
    publicKey = provider.publicKey && provider.publicKey.toString();
  }
  if (!publicKey) throw new Error("No public key returned.");
  return publicKey;
}

export async function disconnectSolanaWallet(walletDef) {
  try {
    var p = walletDef.detect();
    if (p && p.disconnect) await p.disconnect();
  } catch (e) {}
}
