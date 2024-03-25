// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.23;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

struct CreateProfileParams {
  address to;
  address followModule;
  bytes followModuleInitData;
}

interface IDiGiPermissionlessCreator {
  function createProfileWithHandleUsingCredits(
    CreateProfileParams calldata createProfileParams,
    string calldata handle,
    address[] calldata delegatedExecutors
  ) external returns (uint256 profileId, uint256 handleId);
}

contract VibePermissionlessCreator is Initializable, OwnableUpgradeable {
  IDiGiPermissionlessCreator public digiPermissionlessCreator;
  mapping(uint256 => string) public profiles;
  mapping(address => bool) public allowedRelayerAddresses;

  uint256 public signupPrice;
  uint256 public totalCountViaCard;
  uint256 public totalCountViaCrypto;

  error InvalidFunds();
  error CreateNotAllowed();
  error WithdrawalFailed();

  modifier onlyAllowed() {
    require(
      allowedRelayerAddresses[msg.sender],
      'VibePermissionlessCreator: Not allowed'
    );
    _;
  }

  event ProfileCreated(uint256 profileId, uint256 handleId, string handle);

  function initialize(
    address ownerAddress,
    address digiPermissionlessCreatorAddress
  ) public initializer {
    __Ownable_init(ownerAddress);
    digiPermissionlessCreator = IDiGiPermissionlessCreator(
      digiPermissionlessCreatorAddress
    );
    signupPrice = 10 ether;
  }

  function addAllowedRelayerAddresses(
    address[] calldata newAddresses
  ) external onlyOwner {
    for (uint256 i = 0; i < newAddresses.length; i++) {
      allowedRelayerAddresses[newAddresses[i]] = true;
    }
  }

  function removeAllowedRelayerAddress(address addressToRemove) external onlyOwner {
    allowedRelayerAddresses[addressToRemove] = false;
  }

  function createProfileWithHandle(
    CreateProfileParams calldata createProfileParams,
    string calldata handle,
    address[] calldata delegatedExecutors
  ) external onlyAllowed returns (uint256 profileId, uint256 handleId) {
    (profileId, handleId) = digiPermissionlessCreator
      .createProfileWithHandleUsingCredits(
        createProfileParams,
        handle,
        delegatedExecutors
      );

    profiles[profileId] = handle;
    totalCountViaCard++;

    emit ProfileCreated(profileId, handleId, handle);

    return (profileId, handleId);
  }

  function createProfileWithHandleUsingCredits(
    CreateProfileParams calldata createProfileParams,
    string calldata handle,
    address[] calldata delegatedExecutors
  ) external payable returns (uint256 profileId, uint256 handleId) {
    if (msg.value < signupPrice) {
      revert InvalidFunds();
    }

    if (delegatedExecutors.length > 0 && createProfileParams.to != msg.sender) {
      revert CreateNotAllowed();
    }

    (profileId, handleId) = digiPermissionlessCreator
      .createProfileWithHandleUsingCredits(
        createProfileParams,
        handle,
        delegatedExecutors
      );

    profiles[profileId] = handle;
    totalCountViaCrypto++;

    emit ProfileCreated(profileId, handleId, handle);

    return (profileId, handleId);
  }

  function withdrawFunds() external onlyOwner {
    (bool success, ) = payable(owner()).call{value: address(this).balance}('');
    if (!success) {
      revert WithdrawalFailed();
    }
  }

  function setSignupPrice(uint256 _signupPrice) external onlyOwner {
    signupPrice = _signupPrice;
  }

  function setDiGiPermissionlessCreatorAddress(
    address creatorAddress
  ) external onlyOwner {
    digiPermissionlessCreator = IDiGiPermissionlessCreator(creatorAddress);
  }
}
