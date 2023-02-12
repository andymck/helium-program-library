import {
  daoKey,
  init as initDao, subDaoKey
} from "@helium/helium-sub-daos-sdk";
import {
  init as initLazy
} from "@helium/lazy-distributor-sdk";
import * as anchor from "@coral-xyz/anchor";
import { ComputeBudgetProgram, PublicKey } from "@solana/web3.js";
import axios from "axios";
import os from "os";
import yargs from "yargs/yargs";
import { loadKeypair, sendInstructionsOrCreateProposal } from "./utils";

const { hideBin } = require("yargs/helpers");
const yarg = yargs(hideBin(process.argv)).options({
  wallet: {
    alias: "k",
    describe: "Anchor wallet keypair",
    default: `${os.homedir()}/.config/solana/id.json`,
  },
  url: {
    alias: "u",
    default: "http://127.0.0.1:8899",
    describe: "The solana url",
  },
  hntMint: {
    type: "string",
    describe:
      "Mint of the HNT token. Only used if --resetDaoAutomation flag is set",
  },
  dntMint: {
    type: "string",
    describe:
      "Mint of the subdao token. Only used if --resetSubDaoAutomation flag is set",
  },
  resetDaoAutomation: {
    type: "boolean",
    describe: "Reset the dao clockwork automation",
    default: false,
  },
  resetSubDaoAutomation: {
    type: "boolean",
    describe: "Reset the subdao clockwork automation",
    default: false,
  },
  govProgramId: {
    type: "string",
    describe: "Pubkey of the GOV program",
    default: "hgovkRU6Ghe1Qoyb54HdSLdqN7VtxaifBzRmh9jtd3S",
  },
  councilKey: {
    type: "string",
    describe: "Key of gov council token",
    default: "counKsk72Jgf9b3aqyuQpFf12ktLdJbbuhnoSxxQoMJ",
  },
  executeProposal: {
    type: "boolean",
  },
});

async function run() {
  const argv = await yarg.argv;
  process.env.ANCHOR_WALLET = argv.wallet;
  process.env.ANCHOR_PROVIDER_URL = argv.url;
  anchor.setProvider(anchor.AnchorProvider.local(argv.url));

  if (argv.resetSubDaoAutomation && !argv.dntMint) {
    console.log("dnt mint not provided");
    return;
  }
  const councilKey = new PublicKey(argv.councilKey);
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const hsdProgram = await initDao(provider);
  const instructions = [];
  if (argv.resetDaoAutomation) {
    console.log("resetting dao automation")
    const hntMint = new PublicKey(argv.hntMint);
    const dao = daoKey(hntMint)[0];
    const daoAcc = await hsdProgram.account.daoV0.fetch(dao);

    instructions.push(await hsdProgram.methods.resetDaoAutomationV0().accounts({
      dao,
      authority: daoAcc.authority
    }).instruction());
  }

  if (argv.resetSubDaoAutomation) {
    console.log("resetting subdao automation");
    const dntMint = new PublicKey(argv.dntMint);
    const subDao = subDaoKey(dntMint)[0];
    const subdaoAcc = await hsdProgram.account.subDaoV0.fetch(subDao);

    instructions.push(await hsdProgram.methods.resetSubDaoAutomationV0().accounts({
      subDao,
      authority: subdaoAcc.authority
    }).instruction())
  }

  const wallet = loadKeypair(argv.wallet);
  await sendInstructionsOrCreateProposal({
    provider,
    instructions,
    walletSigner: wallet,
    signers: [],
    govProgramId: new PublicKey(argv.govProgramId),
    proposalName: `Reset Automation`,
    votingMint: councilKey,
    executeProposal: argv.executeProposal,
  });
}

run()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then(() => process.exit());
