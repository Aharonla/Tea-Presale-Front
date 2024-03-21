import React, { useEffect, useRef } from 'react';
import { useMetaMaskContext } from '../context/metamask.context';
import { ConnectWallet } from './connect-wallet';
import { SlButton, SlPopup } from '@shoelace-style/shoelace/dist/react';

export const Wallet = () => {
  const [walletOpen, setWalletOpen] = React.useState(false);
  const { status, account, disconnect } = useMetaMaskContext();
  const anchorRef = useRef(null);
  useEffect(() => {
    if (walletOpen) {
      document.addEventListener('click', closeOutsideDialog);
    }

    function closeOutsideDialog(event: MouseEvent) {
      if (anchorRef.current && !(anchorRef.current as HTMLElement).contains(event.target as HTMLElement)) {
        setWalletOpen(false);
      }
    }

    return () => {
      document.removeEventListener('click', closeOutsideDialog);
    };
  }, [walletOpen]);

  return (
    <div className="wallet">
      {status === 'connected' && account ? (
        <SlPopup
          className="popup"
          placement="bottom-end"
          arrow
          arrowPlacement="anchor"
          active={walletOpen}
          ref={anchorRef}
          distance={5}
        >
          <div className="popup__content wallet__content">
            <span className="account">{account}</span>
            <div className="disconnect">
              <SlButton variant="neutral" size="small" onClick={disconnect}>
                Disconnect
              </SlButton>
            </div>
          </div>
          <SlButton
            className="popup__anchor"
            outline
            size="medium"
            onClick={() => setWalletOpen(!walletOpen)}
            slot="anchor"
          >
            {account.slice(0, 6)}...{account.slice(-4)}
            <i slot="suffix" id="wallet-status-icon" className={status}></i>
          </SlButton>
        </SlPopup>
      ) : (
        <ConnectWallet />
      )}
    </div>
  );
};
