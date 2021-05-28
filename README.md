<p align="center">
  <a href="https://github.com/pooltogether/pooltogether--brand-assets">
    <img src="https://github.com/pooltogether/pooltogether--brand-assets/blob/977e03604c49c63314450b5d432fe57d34747c66/logo/pooltogether-logo--purple-gradient.png?raw=true" alt="PoolTogether Brand" style="max-width:100%;" width="200">
  </a>
</p>

<br />

# PoolTogether Badger Wbtc Yield Source 👻


PoolTogether Yield Source that uses [Badger WBTC] to generate yield.

## Deployment

Follow Installation instructions.
`yarn deploy <network_name>`

The deployment script can be found in `deploy/deploy.ts`.

## Development

Clone this repository and enter the directory.

### Installation

Install dependencies:

```
yarn
```

This project uses [Yarn 2](https://yarnpkg.com), dependencies should get installed pretty quickly.

### Env

We use [direnv](https://direnv.net) to manage environment variables. You'll likely need to install it.

Copy `.envrc.example` and write down the env variables needed to run this project.
```
cp .envrc.example .envrc
```

Once your env variables are setup, load them with:
```
direnv allow
```

### Test

We use the [Hardhat](https://hardhat.org) ecosystem to test and deploy our contracts.

To run unit tests:

```
yarn test
```

To run [solhint](https://protofire.github.io/solhint/) and tests:

```
yarn verify
```

To run coverage:

```
yarn coverage
```

### Mainnet fork

Before deploying, you can make sure your implementation works by deploying a Yield Source Prize Pool on a fork of Mainnet.

Start Mainnet fork in a terminal window with the command:

```
yarn start-fork
```

In another window, start the scripts to deploy and create a Badger Wbtc Yield Source Prize Pool, deposit WBTC into it, award the prize and withdraw.

```
yarn run-fork
```

### Contract Verification

Once deployment is done, you can verify your contracts on [Etherscan](https://etherscan.io) by typing:

```
yarn verify <NETWORK_NAME>
```

### Code quality

[Prettier](https://prettier.io) is used to format TypeScript code. Use it by running:

```
yarn format
```

[Solhint](https://protofire.github.io/solhint/) is used to lint Solidity files. Run it with:
```
yarn hint
```

[TypeChain](https://github.com/ethereum-ts/Typechain) is used to generates types for scripts and tests. Generate types by running:
```
yarn typechain
```
