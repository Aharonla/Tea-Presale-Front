import React, { useEffect } from 'react';
import { SlButton, SlPopup } from '@shoelace-style/shoelace/dist/react';
import { ConnectMetamask } from './connect-metamask';
export const ConnectWallet = () => {
  const anchorRef = React.useRef(null);
  const [walletConnectDialog, setWalletConnectDialog] = React.useState(false);

  function toggleWalletConnectDialog() {
    setWalletConnectDialog((prev) => !prev);
  }

  useEffect(() => {
    if (walletConnectDialog) {
      document.addEventListener('click', closeOutsideDialog);
    }

    function closeOutsideDialog(event: MouseEvent) {
      if (anchorRef.current && !(anchorRef.current as HTMLElement).contains(event.target as HTMLElement)) {
        setWalletConnectDialog(false);
      }
    }

    return () => {
      document.removeEventListener('click', closeOutsideDialog);
    };
  }, [walletConnectDialog]);

  return (
    <div className="connect-wallet">
      <SlPopup
        className="popup"
        placement="bottom-end"
        active={walletConnectDialog}
        arrow
        arrowPlacement="end"
        distance={6}
        skidding={2}
        ref={anchorRef}
      >
        <div className="popup__content">
          <ConnectMetamask />
        </div>
        <SlButton
          className="popup__anchor"
          variant="neutral"
          size="medium"
          onClick={toggleWalletConnectDialog}
          slot="anchor"
        >
          Connect Wallet
        </SlButton>
      </SlPopup>
    </div>
  );
};
