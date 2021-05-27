import { wbtc } from '@studydefi/money-legos/erc20';

import { task } from 'hardhat/config';

import { WBTC_RICH_ADDRESS } from '../constants';
import { info, success } from '../helpers';

export default task(
  'fork:distribute-ether-from-binance',
  'Distribute Ether from Binance',
).setAction(async (taskArguments, hre) => {
  info('Gathering funds from Binance...');

  const { getNamedAccounts, ethers } = hre;
  const { provider, getContractAt } = ethers;
  const { deployer } = await getNamedAccounts();

  const wbtc_rich = provider.getUncheckedSigner(WBTC_RICH_ADDRESS);

  const wbtcContract = await getContractAt(wbtc.abi, wbtc.address, wbtc_rich);

  const recipients: { [key: string]: string } = {
    ['Deployer']: deployer,
  };

  const keys = Object.keys(recipients);

  for (var i = 0; i < keys.length; i++) {
    const name = keys[i];
    const address = recipients[name];

    info(`Sending 200 WBTC to ${name}...`);
    await wbtcContract.transfer(address, ethers.utils.parseUnits('200', 8));

    info(`Sending 100 Ether to ${name}...`);
    await wbtc_rich.sendTransaction({ to: address, value: ethers.utils.parseEther('100') });
  }

  success('Done!');
});
