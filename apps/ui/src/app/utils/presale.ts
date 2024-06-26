import { BrowserProvider, Contract, Eip1193Provider, ethers, formatUnits, parseUnits } from 'ethers';
import { ERC20_ABI } from './erc20_abi';
import { PRESALE_ABI } from './presale_abi';
import { PRESALE_CONTRACT_ADDRESS, USDC } from './constants';

export async function getTokenAllowance(tokenAddress: string, ownerAddress: string, spenderAddress: string) {
  // updated provider with custom url for better testnet experience
  const provider = ethers.getDefaultProvider(import.meta.env.VITE_PUBLIC_SEPOLIA_URL);
  const usdtErc20Contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const allowance = await usdtErc20Contract.allowance(ownerAddress, spenderAddress);
  const numDecimals = await usdtErc20Contract.decimals();
  return ethers.formatUnits(allowance, numDecimals);
}

export async function setTokenApprove(tokenAddress: string, value: string, decimal: string) {
  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const signer = await provider.getSigner();
  const contract = new Contract(tokenAddress, ERC20_ABI, signer);
  const amount = parseUnits(value, decimal);
  const tx = await contract.approve(PRESALE_CONTRACT_ADDRESS, amount);
  await tx.wait();
  return {
    status: 'SUCCESS',
    message: 'Transaction Approevd.',
    txid: tx,
  };
}

export async function enterPresaleUtil(value: string, referral: number, token: string) {
  try {
    // updated provider with custom url for better testnet experience
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, signer);
    const decimals = await contract.decimals();
    const amount = parseUnits(value, decimals);
    const tx = await contract.buyTokens(amount, referral, token);
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
        message: `Transaction Failed: ${decodedError?.name}`,
      };
    } else {
      return {
        status: 'FAILURE',
        message: `Transaction Failed:`,
      };
    }
  }
}

export async function getPresaleCurrentRoundInfo() {
  // updated provider with custom url for better testnet experience
  const provider = ethers.getDefaultProvider(import.meta.env.VITE_PUBLIC_SEPOLIA_URL);
  const presaleContract = new ethers.Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, provider);
  const roundEnd = await presaleContract.getRoundEnd();
  const currentRound = await presaleContract.currentRound();
  return {
    currentRound: Number(currentRound),
    roundEnd: Number(roundEnd),
  };
}

export async function getPresaleRoundPrice() {
  // updated provider with custom url for better testnet experience
  const provider = ethers.getDefaultProvider(import.meta.env.VITE_PUBLIC_SEPOLIA_URL);
  const presaleContract = new ethers.Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, provider);
  const roundPrice = await presaleContract.getPrice();
  const roundPercentageRate = await presaleContract.PERCENTAGE_RATE();
  const formattedPrice = ethers.FixedNumber.fromValue(roundPrice);
  const formattedPercentage = ethers.FixedNumber.fromValue(roundPercentageRate);
  return Number(formattedPrice) / Number(formattedPercentage);
}

export async function getPresaleRoundSold() {
  try {
    // updated provider with custom url for better testnet experience
    const provider = ethers.getDefaultProvider(import.meta.env.VITE_PUBLIC_SEPOLIA_URL);
    const presaleContract = new ethers.Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, provider);
    const roundSize = await presaleContract.getRoundSize();
    const roundSold = await presaleContract.getRoundSold();
    const roundDecimal = await presaleContract.decimals();
    return {
      roundSize: Number(ethers.formatUnits(roundSize, roundDecimal)),
      roundSold: Number(ethers.formatUnits(roundSold, roundDecimal)),
    };
  } catch (err) {
    return {
      roundSize: 0,
      roundSold: 0,
    };
  }
}

export async function getPresaleUserBalance(address: string) {
  // updated provider with custom url for better testnet experience
  const provider = ethers.getDefaultProvider(import.meta.env.VITE_PUBLIC_SEPOLIA_URL);
  const presaleContract = new ethers.Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, provider);
  const userBalance = await presaleContract.balanceOf(address);
  const decimals = await presaleContract.decimals();
  return Number(ethers.formatUnits(userBalance, decimals));
}

export async function getPresaleRoundInfo(round: number) {
  // updated provider with custom url for better testnet experience
  const provider = ethers.getDefaultProvider(import.meta.env.VITE_PUBLIC_SEPOLIA_URL);
  const presaleContract = new ethers.Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, provider);
  const roundInfo = await presaleContract.rounds(round);
  return {
    startTime: Number(roundInfo[0]),
    duration: Number(roundInfo[1]),
    size: Number(roundInfo[2]),
    price: Number(roundInfo[3]),
    sold: Number(roundInfo[4]),
  };
}
