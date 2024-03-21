import React from 'react';
import { SlButton, SlSpinner } from '@shoelace-style/shoelace/dist/react';
import metaMaskFoxLogo from '../../assets/icons/metamask-fox.svg';
import { useMetaMaskContext } from '../context/metamask.context';

export const ConnectMetamask = () => {
  const { status, connect } = useMetaMaskContext();

  return (
    <SlButton
      className="connect-wallet__button" variant="default"
      onClick={(status === 'connected') ? undefined : connect}
      data-connected={status === 'connected'} data-connecting={status === 'connecting'}
    >
      <img src={metaMaskFoxLogo} alt="Metamask" />
      <span>Metamask</span>
      {status === 'connecting' && <SlSpinner className="spinner" />}
    </SlButton>
  );
};
