"use client"
import { motion } from "framer-motion"
import { WalletConnection } from "@/components/wallet-connection"
import { TokenSwap } from "@/components/token-swap"
import { TokenSale } from "@/components/token-sale"
import { TransactionHistory } from "@/components/transaction-history"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto max-w-7xl p-8">
        <div className="mb-8 flex justify-end">
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <WalletConnection />
          </motion.div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TokenSwap />
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <TokenSale />
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <TransactionHistory />
        </motion.div>
      </div>
    </div>
  )
}
