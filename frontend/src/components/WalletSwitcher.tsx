// WalletSwitcher.tsx
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const WalletSwitcher: React.FC = () => {
  return (
    <ConnectButton.Custom>
      {({ account, openConnectModal }) => {
        // Only show button if wallet is connected
        if (!account) return null;

        return (
          <div className="flex justify-center mt-2">
            <button
              onClick={openConnectModal}
              className="bg-yellow-500 text-white px-6 py-3 rounded-xl hover:bg-yellow-600 transition-colors"
            >
              Switch Wallet
            </button>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default WalletSwitcher;
