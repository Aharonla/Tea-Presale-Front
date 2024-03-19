import React, { useEffect, useRef } from "react";
import { useMetaMaskContext } from "../context/metamask.context";
import { ConnectWallet } from "./connect-wallet";
import { SlButton, SlPopup } from "@shoelace-style/shoelace/dist/react";
import { WalletConnectButton } from "./wallet-connect";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
  useWeb3Modal,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";

export const Wallet = () => {
  const [walletOpen, setWalletOpen] = React.useState(false);
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { open, close } = useWeb3Modal();

  // const { status, account, disconnect } = useMetaMaskContext();
  // const anchorRef = useRef(null);
  // useEffect(() => {
  //   if (walletOpen) {
  //     document.addEventListener("click", closeOutsideDialog);
  //   }

  //   function closeOutsideDialog(event: MouseEvent) {
  //     if (
  //       anchorRef.current &&
  //       !(anchorRef.current as HTMLElement).contains(
  //         event.target as HTMLElement
  //       )
  //     ) {
  //       setWalletOpen(false);
  //     }
  //   }

  //   return () => {
  //     document.removeEventListener("click", closeOutsideDialog);
  //   };
  // }, [walletOpen]);

  return (
    <div className="wallet">
      {isConnected ? (
        <SlPopup
          className="popup"
          placement="bottom-end"
          arrow
          arrowPlacement="anchor"
          active={walletOpen}
          // ref={anchorRef}
          distance={5}
        >
          <SlButton
            className="popup__anchor"
            outline
            size="medium"
            onClick={() => open()}
            slot="anchor"
          >
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </SlButton>
        </SlPopup>
      ) : (
        <WalletConnectButton />
      )}
    </div>
  );
};
