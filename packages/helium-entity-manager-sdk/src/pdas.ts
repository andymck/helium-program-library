import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "./constants";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import crypto from "crypto";
// @ts-ignore
import bs58 from "bs58";

async function hashAnyhere(input: Buffer) {
  /// @ts-ignore
  if (typeof window != "undefined") {
    return crypto.subtle.digest("SHA-256", input);
  } else {
    const { createHash } = await import("crypto");
    return createHash("sha256").update(input).digest();
  }
}

export const rewardableEntityConfigKey = (
  subDao: PublicKey,
  symbol: string,
  programId: PublicKey = PROGRAM_ID
) =>
  PublicKey.findProgramAddressSync(
    [
      Buffer.from("rewardable_entity_config", "utf-8"),
      subDao.toBuffer(),
      Buffer.from(symbol, "utf-8"),
    ],
    programId
  );

export const hotspotCollectionKey = (
  maker: PublicKey,
  programId: PublicKey = PROGRAM_ID
) =>
  PublicKey.findProgramAddressSync(
    [Buffer.from("collection", "utf-8"), maker.toBuffer()],
    programId
  );

export const makerKey = (name: String, programId: PublicKey = PROGRAM_ID) =>
  PublicKey.findProgramAddressSync(
    [Buffer.from("maker", "utf-8"), Buffer.from(name, "utf-8")],
    programId
  );

export const makerApprovalKey = (
  rewardableEntityConfig: PublicKey,
  maker: PublicKey,
  programId: PublicKey = PROGRAM_ID
) =>
  PublicKey.findProgramAddressSync(
    [
      Buffer.from("maker_approval", "utf-8"),
      rewardableEntityConfig.toBuffer(),
      maker.toBuffer(),
    ],
    programId
  );

export const keyToAssetKey = async (
  dao: PublicKey,
  entityKey: Buffer | string,
  programId: PublicKey = PROGRAM_ID
) => {
  if (typeof entityKey === "string") {
    entityKey = Buffer.from(bs58.decode(entityKey));
  }
  const hash = await hashAnyhere(entityKey);

  return PublicKey.findProgramAddressSync(
    [Buffer.from("key_to_asset", "utf-8"), dao.toBuffer(), Buffer.from(hash)],
    programId
  );
};

export const iotInfoKey = async (
  rewardableEntityConfig: PublicKey,
  entityKey: Buffer | string,
  programId: PublicKey = PROGRAM_ID
) => {
  if (typeof entityKey === "string") {
    entityKey = Buffer.from(bs58.decode(entityKey));
  }
  const hash = await hashAnyhere(entityKey);

  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("iot_info", "utf-8"),
      rewardableEntityConfig.toBuffer(),
      Buffer.from(hash),
    ],
    programId
  );
};

export const mobileInfoKey = async (
  rewardableEntityConfig: PublicKey,
  entityKey: Buffer | string,
  programId: PublicKey = PROGRAM_ID
) => {
  if (typeof entityKey === "string") {
    entityKey = Buffer.from(bs58.decode(entityKey));
  }
  const hash = await hashAnyhere(entityKey);

  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("mobile_info", "utf-8"),
      rewardableEntityConfig.toBuffer(),
      Buffer.from(hash),
    ],
    programId
  );
};

export const collectionMetadataKey = (
  collection: PublicKey,
  programId: PublicKey = TOKEN_METADATA_PROGRAM_ID
) =>
  PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata", "utf-8"),
      programId.toBuffer(),
      collection.toBuffer(),
    ],
    programId
  );
