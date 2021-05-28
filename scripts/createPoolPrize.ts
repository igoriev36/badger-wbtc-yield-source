import PoolWithMultipleWinnersBuilder from '@pooltogether/pooltogether-contracts/deployments/mainnet/PoolWithMultipleWinnersBuilder.json';
import RNGBlockhash from '@pooltogether/pooltogether-rng-contracts/deployments/mainnet/RNGBlockhash.json';
import ControlledToken from '@pooltogether/pooltogether-contracts/abis/ControlledToken.json';
import MultipleWinners from '@pooltogether/pooltogether-contracts/abis/MultipleWinners.json';
import YieldSourcePrizePool from '@pooltogether/pooltogether-contracts/abis/YieldSourcePrizePool.json';
import hre from "hardhat";
import { wbtc } from '@studydefi/money-legos/erc20';


import {
  BADGER_WBTC_VAULT_ADDRESS_MAINNET,
  WBTC_RICH_ADDRESS,
} from './constants';

import { info, success } from './helpers';


async function poolCycle() {
    const { ethers } = hre;
    const { constants, provider, getContractAt, getContractFactory, getSigners, utils } = ethers;
    const { AddressZero } = constants;
    const { getBlock, getBlockNumber, getTransactionReceipt, send } = provider;

    async function increaseTime(time: number) {
      await send('evm_increaseTime', [time]);
      await send('evm_mine', []);
    }

    const accountToImpersonate = WBTC_RICH_ADDRESS;
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [accountToImpersonate]
    })
    let contractsOwner = await ethers.provider.getSigner(accountToImpersonate)

    info('Deploying BadgerWBTCVaultYieldSource...');

    const BadgerWBTCVaultYieldSourceFactory = await getContractFactory('WBTCVaultYieldSource');

    const BadgerWBTCVaultYieldSource = (await BadgerWBTCVaultYieldSourceFactory.deploy());

    await BadgerWBTCVaultYieldSource.initialize(
      BADGER_WBTC_VAULT_ADDRESS_MAINNET,
      wbtc.address
    );

    info('Deploying WbtcYieldSourcePrizePool...');

    const poolBuilder = await getContractAt(
      PoolWithMultipleWinnersBuilder.abi,
      PoolWithMultipleWinnersBuilder.address,
      contractsOwner,
    );

    const wbtcYieldSourcePrizePoolConfig = {
      yieldSource: BadgerWBTCVaultYieldSource.address,
      maxExitFeeMantissa: ethers.utils.parseUnits('0.5', 8),
      maxTimelockDuration: 1000,
    };

    const block = await getBlock(await getBlockNumber());

    const multipleWinnersConfig = {
      rngService: RNGBlockhash.address,
      prizePeriodStart: block.timestamp,
      prizePeriodSeconds: 60,
      ticketName: 'Ticket',
      ticketSymbol: 'TICK',
      sponsorshipName: 'Sponsorship',
      sponsorshipSymbol: 'SPON',
      ticketCreditLimitMantissa: ethers.utils.parseEther('0.1'),
      ticketCreditRateMantissa: ethers.utils.parseEther('0.001'),
      numberOfWinners: 1,
    };

    const yieldSourceMultipleWinnersTx = await poolBuilder.createYieldSourceMultipleWinners(
      wbtcYieldSourcePrizePoolConfig,
      multipleWinnersConfig,
      8,
    );

    await new Promise(r => setTimeout(r, 120000));

    const yieldSourceMultipleWinnersReceipt = await getTransactionReceipt(
      yieldSourceMultipleWinnersTx.hash,
    );

    const yieldSourcePrizePoolInitializedEvent = yieldSourceMultipleWinnersReceipt.logs.map(
      (log) => {
        try {
          return poolBuilder.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      },
    );

    const prizePool = await getContractAt(
      YieldSourcePrizePool,
      yieldSourcePrizePoolInitializedEvent[yieldSourcePrizePoolInitializedEvent.length - 1]?.args[
        'prizePool'
      ],
      contractsOwner,
    );

    success(`Deployed BadgeWBTCYieldSourcePrizePool! ${prizePool.address}`);

    console.log("WBTC address: ", wbtc.address);
    console.log("Badger Vault address: ", BADGER_WBTC_VAULT_ADDRESS_MAINNET);
    console.log("Yield Source Addres: ", BadgerWBTCVaultYieldSource.address);

    const prizeStrategy = await getContractAt(
      MultipleWinners,
      await prizePool.prizeStrategy(),
      contractsOwner,
    );
    await prizeStrategy.addExternalErc20Award(wbtc.address);

    const wbtcAmount = ethers.utils.parseUnits('10', 8);
    const wbtcContract = await getContractAt(wbtc.abi, wbtc.address, contractsOwner);
    await wbtcContract.approve(prizePool.address, wbtcAmount);
    
    info(`Depositing ${ethers.utils.formatUnits(wbtcAmount, 8)} WBTC...`);

    await prizePool.depositTo(
      contractsOwner._address,
      wbtcAmount,
      await prizeStrategy.ticket(),
      AddressZero,
    );

    success('Deposited WBTC!');
    
    info(`Prize strategy owner: ${await prizeStrategy.owner()}`);
    await increaseTime(30);

    // simulating returns in the vault during the prizePeriod
    const wbtcProfits = ethers.utils.parseUnits('100', 8);
    info(`Vault generated ${ethers.utils.formatUnits(wbtcProfits, 8)} WBTC`);
    await wbtcContract.transfer(BADGER_WBTC_VAULT_ADDRESS_MAINNET, wbtcProfits);

    await increaseTime(30);

    info('Starting award...');
    await prizeStrategy.startAward();
    await increaseTime(1);

    info('Completing award...');

    const awardTx = await prizeStrategy.completeAward();
    const awardReceipt = await getTransactionReceipt(awardTx.hash);
    const awardLogs = awardReceipt.logs.map((log) => {
      try {
        return prizePool.interface.parseLog(log);
      } catch (e) {
        return null;
      }
    });

    const awarded = awardLogs.find((event) => event && event.name === 'Awarded');

    success(`Awarded ${ethers.utils.formatUnits(awarded?.args?.amount, 8)} WBTC!`);

    info('Withdrawing...');
    const ticketAddress = await prizeStrategy.ticket();
    const ticket = await getContractAt(ControlledToken, ticketAddress, contractsOwner);
    const withdrawalAmount = ethers.utils.parseUnits('100', 6);
    const earlyExitFee = await prizePool.callStatic.calculateEarlyExitFee(contractsOwner._address, ticket.address, withdrawalAmount);

    const withdrawTx = await prizePool.withdrawInstantlyFrom(
      contractsOwner._address,
      withdrawalAmount,
      ticket.address,
      earlyExitFee.exitFee,
    );

    const withdrawReceipt = await getTransactionReceipt(withdrawTx.hash);
    const withdrawLogs = withdrawReceipt.logs.map((log) => {
      try {
        return prizePool.interface.parseLog(log);
      } catch (e) {
        return null;
      }
    });

    const withdrawn = withdrawLogs.find((event) => event && event.name === 'InstantWithdrawal');
    success(`Withdrawn ${ethers.utils.formatUnits(withdrawn?.args?.redeemed, 6)} WBTC!`);
    success(`Exit fee was ${ethers.utils.formatUnits(withdrawn?.args?.exitFee, 6)} WBTC`);

    await prizePool.captureAwardBalance();
    const awardBalance = await prizePool.callStatic.awardBalance();
    success(`Current awardable balance is ${ethers.utils.formatUnits(awardBalance, 8)} WBTC`)
  }

poolCycle()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});
