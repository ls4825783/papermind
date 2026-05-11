"use client";
import { SOLANA_WALLETS } from "@/lib/solanaWallets";
import { truncAddr } from "@/lib/parse";

export default function WalletModal({ wallet, onConnect, onDisconnect, onClose, myScansCount }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">
            {wallet ? "Your Wallet" : "Connect Solana Wallet"}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {wallet ? (
          <div className="profile-wrap">
            <div className="profile-avatar">{wallet.icon}</div>
            <div className="profile-addr">◎ {truncAddr(wallet.addr)}</div>
            <div className="profile-chain">Solana Mainnet · {wallet.name}</div>
            <div className="profile-scans">
              {myScansCount} scan{myScansCount !== 1 ? "s" : ""} saved to this wallet
            </div>
            <button className="disconnect-btn" onClick={onDisconnect}>
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <>
            <div className="modal-sub">
              Save scan history &amp; ratings to your Solana wallet
            </div>
            {SOLANA_WALLETS.map((w) => {
              const available = !!w.detect();
              return (
                <div key={w.id} className="wallet-option" onClick={() => onConnect(w)}>
                  <div
                    className="wallet-option-icon"
                    style={{
                      background: available
                        ? "rgba(153,69,255,0.08)"
                        : "rgba(232,234,240,0.025)",
                    }}
                  >
                    {w.icon}
                  </div>
                  <div>
                    <div className="wallet-option-name">{w.name}</div>
                    <div className="wallet-option-desc">{w.desc}</div>
                  </div>
                  <div className={`wallet-badge ${available ? "wallet-badge-ok" : "wallet-badge-no"}`}>
                    {available ? "DETECTED" : "INSTALL"}
                  </div>
                </div>
              );
            })}
            <div className="no-wallet-hint">
              No wallet?{" "}
              <a href="https://phantom.app" target="_blank" rel="noreferrer">
                Get Phantom
              </a>{" "}
              — free &amp; takes 2 min.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
