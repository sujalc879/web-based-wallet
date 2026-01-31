import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import bs58 from "bs58";

export async function sendSolTransaction({
  fromPrivateKey,
  toAddress,
  amountSol,
}) {
  const connection = new Connection(
    import.meta.env.VITE_ALCHEMY_URL,
    "confirmed"
  );

  const senderKeypair = Keypair.fromSecretKey(
    bs58.decode(fromPrivateKey)
  );

  // 1️⃣ Build transaction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: senderKeypair.publicKey,
      toPubkey: new PublicKey(toAddress),
      lamports: Math.floor(amountSol * LAMPORTS_PER_SOL),
    })
  );

  // 2️⃣ Get recent blockhash (CRITICAL)
  const latestBlockhash = await connection.getLatestBlockhash();

  transaction.recentBlockhash = latestBlockhash.blockhash;
  transaction.feePayer = senderKeypair.publicKey;

  // 3️⃣ Sign & send
  transaction.sign(senderKeypair);

  const signature = await connection.sendRawTransaction(
    transaction.serialize()
  );

  // 4️⃣ Confirm with blockhash context (THIS FIXES HANG)
  await connection.confirmTransaction(
    {
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    },
    "confirmed"
  );

  return signature;
}
