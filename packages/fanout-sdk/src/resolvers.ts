import {
  ataResolver,
  combineResolvers, heliumCommonResolver
} from "@helium/spl-utils";

export const fanoutResolvers = combineResolvers(
  heliumCommonResolver,
  ataResolver({
    instruction: "initializeFanoutV0",
    account: "tokenAccount",
    mint: "membershipMint",
    owner: "fanout",
  }),
  ataResolver({
    instruction: "stakeV0",
    account: "fromAccount",
    mint: "membershipMint",
    owner: "staker",
  }),
  ataResolver({
    instruction: "stakeV0",
    account: "stakesAccount",
    mint: "membershipMint",
    owner: "fanout",
  }),
  ataResolver({
    instruction: "stakeV0",
    account: "receiptAccount",
    mint: "mint",
    owner: "recipient",
  }),
  ataResolver({
    instruction: "unstakeV0",
    account: "receiptccount",
    mint: "mint",
    owner: "recipient",
  })
);