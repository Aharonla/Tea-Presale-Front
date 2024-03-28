import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { FunctionComponent, ReactNode } from 'react';
import MetaMaskSDK, { SDKProvider } from '@metamask/sdk';
import { ethers } from 'ethers';
import { ERC20_ABI } from '../utils/erc20_abi';
import { USDT, USDC } from '../utils/constants';
import { CoinType } from '../pages/buy';

enum MetaMaskEvents {
  REQUEST_ACCOUNTS = 'eth_requestAccounts',
  ACCOUNTS = 'eth_accounts',
  ACCOUNTS_CHANGED = 'accountsChanged',
  GET_BALANCE = 'eth_getBalance',
}

enum MetaMaskStatus {
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  DISCONNECTED = 'disconnected',
  DISCONNECTING = 'disconnecting',
}

export interface MetaMaskContext {
  account: string | null;
  status: MetaMaskStatus;
  connect: () => void;
  disconnect: () => void;
  balance: Record<CoinType, null | string>;
}

const METAMASK_ACCOUNT_LOCALSTORAGE_KEY = 'metamask_account';
export const MetaMaskContext = createContext<MetaMaskContext | null>(null);

const initialValues = {
  account: null,
  status: MetaMaskStatus.DISCONNECTED,
};

type ContextValues = typeof initialValues;
export const MetaMaskProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const ethereumRef = useRef(initSDK());
  const [values, setValues] = useState<Pick<MetaMaskContext, keyof ContextValues>>(initValues());
  const [balanceETH, setBalanceETH] = useState<string | null>(null);
  const [balanceUSDT, setBalanceUSDT] = useState<string | null>(null);
  const [balanceUSDC, setBalanceUSDC] = useState<string | null>(null);

  function initSDK(): MetaMaskSDK {
    return new MetaMaskSDK({
      dappMetadata: {
        name: 'Tea',
        url: `http${import.meta.env.DEV ? '' : 's'}://${window.location.href.split('/')[2]}`,
      },
      infuraAPIKey: import.meta.env.VITE_PUBLIC_INFURA_API,
      extensionOnly: true,
    });
  }

  function initValues() {
    const storedValues = window.localStorage.getItem(METAMASK_ACCOUNT_LOCALSTORAGE_KEY);
    if (storedValues) {
      return JSON.parse(storedValues);
    }
    return initialValues;
  }

  const _getBalance = useCallback(async (address: string, block = 'latest') => {
    try {
      const ethereum = ethereumRef.current.getProvider();
      const balance = (await ethereum?.request({
        method: MetaMaskEvents.GET_BALANCE,
        params: [address, block],
      })) as string;

      // const usdtBalance = await getFormattedBalanceOfErc20TokenHolder(USDT, address);
      const usdcBalance = await getFormattedBalanceOfErc20TokenHolder(USDC, address);

      if (balance === '0x') {
        setBalanceETH('0');
        return;
      }
      setBalanceETH(ethers.formatUnits(balance));

      // setBalanceUSDT(usdtBalance);  // removed in testnet
      setBalanceUSDC(usdcBalance);
    } catch (err) {
      console.error('==>', err);
    }
  }, []);

  const onAccountsChanged = useCallback(
    (accounts: any) => {
      const [account] = accounts as string[];
      if (account) {
        _getBalance(account);
        setValues((values) => ({ ...values, account: account, status: MetaMaskStatus.CONNECTED }));
      } else {
        setBalanceETH(null);
        setValues((values) => ({ ...values, account: null, status: MetaMaskStatus.DISCONNECTED }));
      }
    },
    [_getBalance]
  );

  const onAccountsError = useCallback((e: any) => {
    /* User cancelled or exited the popup (rejected request) */
    if (e.code === 4001) {
      setBalanceETH(null);
      setValues((values) => ({ ...values, account: null, status: MetaMaskStatus.DISCONNECTED }));
    }
  }, []);

  const connect = useCallback(() => {
    if (ethereumRef.current) {
      setValues((values) => ({ ...values, status: MetaMaskStatus.CONNECTING }));
      const ethereum = ethereumRef.current.getProvider();
      ethereum;
      ''.request({ method: MetaMaskEvents.REQUEST_ACCOUNTS }).then(onAccountsChanged).catch(onAccountsError);
    }
  }, [onAccountsChanged, onAccountsError]);

  const disconnect = useCallback(() => {
    setBalanceETH(() => null);
    setBalanceUSDT(() => null);
    setValues((values) => ({ ...values, account: null, status: MetaMaskStatus.DISCONNECTED }));
  }, []);

  async function getFormattedBalanceOfErc20TokenHolder(contractAddress: string, address: string) {
    // updated provider with custom url for better testnet experience
    const provider = ethers.getDefaultProvider(import.meta.env.VITE_PUBLIC_SEPOLIA_URL);
    const usdtErc20Contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);

    const balance = await usdtErc20Contract.balanceOf(address);
    const numDecimals = await usdtErc20Contract.decimals();

    return ethers.formatUnits(balance, numDecimals);
  }

  const initAccountsListener = useCallback(() => {
    const ethereum = ethereumRef.current.getProvider();
    if (!ethereum?.isConnected()) setTimeout(initAccountsListener, 500);

    /* Register listener for account changes */
    ethereum?.on(MetaMaskEvents.ACCOUNTS_CHANGED, onAccountsChanged);

    /* Request account unless a connecting process is pending or is in a disconnected state */
    if (values.status !== MetaMaskStatus.CONNECTING && values.status !== MetaMaskStatus.DISCONNECTED) {
      ethereum?.request({ method: MetaMaskEvents.ACCOUNTS }).then(onAccountsChanged).catch(onAccountsError);
    }
  }, [onAccountsChanged, onAccountsError, values.status]);

  useEffect(() => {
    let ethereum: SDKProvider;

    setTimeout(initAccountsListener, 500);

    return () => {
      ethereum?.removeAllListeners(MetaMaskEvents.ACCOUNTS_CHANGED);
    };
  }, [initAccountsListener, onAccountsChanged, onAccountsError]);

  useEffect(() => {
    window.localStorage.setItem(METAMASK_ACCOUNT_LOCALSTORAGE_KEY, JSON.stringify(values));
  }, [values]);

  return (
    <MetaMaskContext.Provider
      value={{
        ...values,
        connect,
        disconnect,
        balance: {
          eth: balanceETH,
          usdt: balanceUSDT,
          usdc: balanceUSDC,
        },
      }}
      children={children}
    />
  );
};

export const useMetaMaskContext = (): MetaMaskContext => {
  const contextValue = useContext(MetaMaskContext);
  if (!contextValue) {
    throw new Error('Tried to use template context from outside the provider');
  }
  return contextValue;
};
