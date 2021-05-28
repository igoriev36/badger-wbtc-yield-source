// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

interface ISimpleWrapperGatedUpgradeable {
  function DOMAIN_SEPARATOR (  ) external view returns ( bytes32 );
  function DOMAIN_TYPEHASH (  ) external view returns ( bytes32 );
  function PERMIT_TYPEHASH (  ) external view returns ( bytes32 );
  function acceptAffiliate (  ) external;
  function affiliate (  ) external view returns ( address );
  function allowance ( address owner, address spender ) external view returns ( uint256 );
  function approve ( address spender, uint256 amount ) external returns ( bool );
  function balanceOf ( address account ) external view returns ( uint256 );
  function bestVault (  ) external view returns ( address );
  function decimals (  ) external view returns ( uint8 );
  function decreaseAllowance ( address spender, uint256 subtractedValue ) external returns ( bool );
  function deposit ( uint256 amount, bytes32[] calldata merkleProof ) external returns ( uint256 );
  function deposit ( bytes32[] calldata merkleProof ) external returns ( uint256 );
  function depositFor ( address recipient, uint256 amount ) external returns ( uint256 deposited );
  function depositFor ( address recipient, uint256 amount, bytes32[] calldata merkleProof ) external returns ( uint256 );
  function experimentalMode (  ) external view returns ( bool );
  function experimentalVault (  ) external view returns ( address );
  function guardian (  ) external view returns ( address );
  function guestList (  ) external view returns ( address );
  function increaseAllowance ( address spender, uint256 addedValue ) external returns ( bool );
  function initialize ( address _token, address _registry, string calldata name, string calldata symbol, address _guardian, bool _useExperimentalMode, address _experimentalVault ) external;
  function manager (  ) external view returns ( address );
  function name (  ) external view returns ( string calldata);
  function nonces ( address ) external view returns ( uint256 );
  function pause (  ) external;
  function paused (  ) external view returns ( bool );
  function pendingAffiliate (  ) external view returns ( address );
  function permit ( address owner, address spender, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s ) external;
  function pricePerShare (  ) external view returns ( uint256 );
  function registry (  ) external view returns ( address );
  function setAffiliate ( address _affiliate ) external;
  function setGuardian ( address _guardian ) external;
  function setGuestList ( address _guestList ) external;
  function setManager ( address _manager ) external;
  function setRegistry ( address _registry ) external;
  function setWithdrawalFee ( uint256 _fee ) external;
  function setWithdrawalMaxDeviationThreshold ( uint256 _maxDeviationThreshold ) external;
  function shareValue ( uint256 numShares ) external view returns ( uint256 );
  function symbol (  ) external view returns ( string calldata);
  function token (  ) external view returns ( address );
  function totalAssets (  ) external view returns ( uint256 assets );
  function totalSupply (  ) external view returns ( uint256 );
  function totalVaultBalance ( address account ) external view returns ( uint256 balance );
  function totalWrapperBalance ( address account ) external view returns ( uint256 balance );
  function transfer ( address recipient, uint256 amount ) external returns ( bool );
  function transferFrom ( address sender, address recipient, uint256 amount ) external returns ( bool );
  function unpause (  ) external;
  function withdraw ( uint256 shares ) external returns ( uint256 withdrawn );
  function withdraw (  ) external returns ( uint256 );
  function withdrawalFee (  ) external view returns ( uint256 );
  function withdrawalMaxDeviationThreshold (  ) external view returns ( uint256 );
}