import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SolWallet from "./components/SolWallet";
import GetBalance from "./components/ui/GetBalance";
import { sendSolTransaction } from "./components/ui/sendTransaction";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

const seedVariants = {
  hidden: {
    filter: "blur(8px)",
    opacity: 0.6,
  },
  visible: {
    filter: "blur(0px)",
    opacity: 1,
  },
};

const copiedVariants = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};


export default function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [wallets, setWallets] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [showSend, setShowSend] = useState(false);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [balanceRefreshKey, setBalanceRefreshKey] = useState(0);
  const mnemonicInput = useRef("");
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [sendError, setSendError] = useState("");



  const addWallet = () => {
    const finalMnemonic =
      mnemonicInput.current.value.trim() || generateMnemonic();

    const seed = mnemonicToSeedSync(finalMnemonic);
    const derivedSeed = derivePath(
      "m/44'/501'/0'/0'",
      seed.toString("hex")
    ).key;

    const keypair = Keypair.fromSeed(derivedSeed);

    setMnemonic(finalMnemonic);
    setSelectedValue(keypair.publicKey.toBase58());
    setWallets([
      {
        index: 0,
        publicKey: keypair.publicKey.toBase58(),
        privateKey: bs58.encode(keypair.secretKey),
      },
    ]);
  };

  const addDerivedWallet = () => {
  if (!mnemonic) return;

  const seed = mnemonicToSeedSync(mnemonic);
  const index = wallets.length;

  const derivedSeed = derivePath(
    `m/44'/501'/${index}'/0'`,
    seed.toString("hex")
  ).key;

  const keypair = Keypair.fromSeed(derivedSeed);

  setWallets(prev => [
    ...prev,
    {
      index,
      publicKey: keypair.publicKey.toBase58(),
      privateKey: bs58.encode(keypair.secretKey),
    },
  ]);
};

const copyMnemonic = async () => {
  try {
    await navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  } catch {
    alert("Failed to copy seed phrase");
  }
};



  useEffect(() => {
  const savedMnemonic = localStorage.getItem("mnemonic");
  const savedWallets = localStorage.getItem("wallets");
  const savedSelected = localStorage.getItem("selectedWallet");

  if (savedMnemonic && savedWallets) {
    setMnemonic(savedMnemonic);
    setWallets(JSON.parse(savedWallets));
    setSelectedValue(savedSelected || JSON.parse(savedWallets)[0].publicKey);
  }
}, []);

  useEffect(() => {
  if (mnemonic) {
    localStorage.setItem("mnemonic", mnemonic);
  }
}, [mnemonic]);

useEffect(() => {
  if (wallets.length > 0) {
    localStorage.setItem("wallets", JSON.stringify(wallets));
  }
}, [wallets]);

useEffect(() => {
  if (selectedValue) {
    localStorage.setItem("selectedWallet", selectedValue);
  }
}, [selectedValue]);



  const handleSend = async () => {
  setSendError("");

  if (!amount || Number(amount) <= 0) {
    setSendError("Enter a valid amount");
    return;
  }

  if (currentBalance === null) {
    setSendError("Balance not loaded yet");
    return;
  }

  if (Number(amount) > currentBalance) {
    setSendError("Insufficient balance");
    return;
  }

  try {
    const sender = wallets.find(w => w.publicKey === selectedValue);
    if (!sender) return;

    setSending(true);

    await sendSolTransaction({
      fromPrivateKey: sender.privateKey,
      toAddress,
      amountSol: Number(amount),
    });

    setBalanceRefreshKey(p => p + 1);
    setShowSend(false);
    setToAddress("");
    setAmount("");
  } catch (err) {
    setSendError("Transaction failed. Please try again.");
  } finally {
    setSending(false);
  }
};


  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-semibold"
      >
        Solana Wallet
      </motion.h1>

      {/* Seed */}
      <section className="card">
        <input
          ref={mnemonicInput}
          placeholder="Enter seed phrase (optional)"
          className="input"
        />
        <button className="btn-primary mt-3" onClick={addWallet}>
          Create Wallet
        </button>

        {mnemonic && (
  <div className="mt-4 space-y-2">
    <motion.div
  className="font-mono text-sm p-3 rounded bg-stone-50 border select-none"
  variants={seedVariants}
  animate={showMnemonic ? "visible" : "hidden"}
  transition={{ duration: 0.35, ease: "easeOut" }}
>
  {mnemonic}
</motion.div>


    <div className="flex gap-2">
      <motion.button
  className="btn-secondary"
  whileTap={{ scale: 0.96 }}
  onClick={() => setShowMnemonic(prev => !prev)}
>
  {showMnemonic ? "Hide Seed Phrase" : "Reveal Seed Phrase"}
</motion.button>


      <motion.button
  className="btn-secondary relative overflow-hidden"
  whileTap={{ scale: 0.96 }}
  onClick={copyMnemonic}
  disabled={!showMnemonic}
>
  <AnimatePresence mode="wait">
    {!copied ? (
      <motion.span
        key="copy"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        Copy
      </motion.span>
    ) : (
      <motion.span
        key="copied"
        variants={copiedVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="text-green-600"
      >
        Copied ✓
      </motion.span>
    )}
  </AnimatePresence>
</motion.button>

    </div>

    <p className="text-xs text-stone-500">
      Never share your seed phrase with anyone.
    </p>
  </div>
)}

      </section>

      {/* Wallet selector */}
      {wallets.length > 0 && (
        <section className="card">
          <label className="label">Wallet</label>
          <select
            value={selectedValue}
            onChange={e => setSelectedValue(e.target.value)}
            className="input"
          >
            {wallets.map(w => (
              <option key={w.index} value={w.publicKey}>
                Wallet {w.index}
              </option>
            ))}
          </select>

          <GetBalance
            selectedValue={selectedValue}
            refreshKey={balanceRefreshKey}
            onBalance={setCurrentBalance}
          />
        </section>
      )}

      {/* Send */}
      <section className="card">
        <button className="btn-secondary" onClick={() => setShowSend(true)}>
          Send SOL
        </button>

        <AnimatePresence>
  {showSend && (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mt-4 space-y-3"
    >
      <input
        className="input"
        placeholder="Recipient address"
        value={toAddress}
        onChange={e => setToAddress(e.target.value)}
      />

      <input
        className="input"
        placeholder="Amount (SOL)"
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />

      {sendError && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-600 text-center"
        >
          {sendError}
        </motion.p>
      )}

      <button
        className="btn-primary"
        onClick={handleSend}
        disabled={sending}
      >
        {sending ? "Sending…" : "Confirm"}
      </button>
    </motion.div>
  )}
</AnimatePresence>

      </section>

      <SolWallet
  wallets={wallets}
  onAddWallet={addDerivedWallet}
/>

    </main>
  );
}
