import { BrowserProvider, Contract, Eip1193Provider, ethers, formatUnits, parseUnits } from 'ethers';
import { ERC20_ABI } from './erc20_abi';
import { PRESALE_ABI } from './presale_abi';
import { PRESALE_CONTRACT_ADDRESS, USDC } from './constants';

export async function getTokenAllowance(tokenAddress: string, ownerAddress: string, spenderAddress: string) {
  // updated provider with custom url for better testnet experience
  const provider = ethers.getDefaultProvider(import.meta.env.VITE_PUBLIC_SEPOLIA_URL);
  const usdtErc20Contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const balance = await usdtErc20Contract.allowance(ownerAddress, spenderAddress);
  const numDecimals = await usdtErc20Contract.decimals();
  return ethers.formatUnits(balance, numDecimals);
}

export async function setTokenApprove(tokenAddress: string, spenderAddress: string, value: number) {
  try {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(tokenAddress, ERC20_ABI, signer);
    const amount = parseUnits(String(value), 6);
    const tx = await contract.approve(spenderAddress, amount);
    await tx.wait();
    return {
      status: 'SUCCESS',
      message: 'Transaction Approevd.',
      txid: tx,
    };
  } catch (err: any) {
    return {
      status: 'FAILURE',
      message: 'Transaction Rejected.',
    };
  }
}

export async function enterPersale(value: number, referral: number) {
  try {
    // updated provider with custom url for better testnet experience
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, signer);
    const amount = parseUnits(String(value), 18);
    const tx = await contract.buyTokens(amount, referral, USDC);
    await tx.wait();
    return {
      status: 'SUCCESS',
      message: 'Transaction Approevd.',
      txid: tx,
    };
  } catch (e: any) {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, signer);

    if (e.data && contract) {
      const decodedError = contract.interface.parseError(e.data);
      return {
        status: 'FAILURE',
        message: `Transaction failed: ${decodedError?.name}`,
      };
    } else {
      return {
        status: 'FAILURE',
        message: `Transaction failed:`,
      };
    }
  }
}

export async function getPresaleRoundEnd() {
  // updated provider with custom url for better testnet experience
  const provider = ethers.getDefaultProvider(import.meta.env.VITE_PUBLIC_SEPOLIA_URL);
  const usdtErc20Contract = new ethers.Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, provider);
  const roundInfo = await usdtErc20Contract.getRoundEnd();
  const formatted = ethers.FixedNumber.fromValue(roundInfo);
  return Number(formatted._value);
}
