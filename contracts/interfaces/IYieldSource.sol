// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

/// @title Defines the functions used to interact with a yield source.  The Prize Pool inherits this contract.
/// @notice Prize Pools subclasses need to implement this interface so that yield can be generated.
interface IYieldSource {
  /// @notice Returns the ERC20 asset token used for deposits.
  /// @return The ERC20 asset token
  function token() external view returns (IERC20Upgradeable);

  /// @notice Supplies asset tokens to the yield source.  Allows assets to be supplied on other user's behalf using the `to` param.
  /// @param mintAmount The amount of asset tokens to be supplied
  /// @param to The user whose balance will receive the tokens
  function supplyTo(uint256 mintAmount, address to) external;

  /// @notice Redeems asset tokens from the yield source.
  /// @param redeemAmount The amount of yield-bearing tokens to be redeemed
  /// @return The actual amount of tokens that were redeemed.
  function redeem(uint256 redeemAmount) external returns (uint256);
}
