import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function SolWallet({ wallets, onAddWallet }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyAddress = async (address, index) => {
    await navigator.clipboard.writeText(address);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1200);
  };

  return (
    <section className="card space-y-4">
      {/* Add wallet button */}
      <motion.button
        className="btn-secondary w-full"
        whileTap={{ scale: 0.97 }}
        onClick={onAddWallet}
      >
        + Add Wallet
      </motion.button>

      {/* Wallet list */}
      <ul className="space-y-3">
        <AnimatePresence>
          {wallets.map(wallet => (
            <motion.li
              key={wallet.index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex items-center justify-between gap-3 
                         bg-stone-50 border rounded px-3 py-2"
            >
              {/* Address */}
              <span className="font-mono text-xs truncate">
                Wallet {wallet.index}: {wallet.publicKey}
              </span>

              {/* Copy button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => copyAddress(wallet.publicKey, wallet.index)}
                className="text-xs text-stone-500 hover:text-stone-800"
              >
                {copiedIndex === wallet.index ? "Copied ✓" : "Copy"}
              </motion.button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
}
