"use client"

import { useState } from "react"
import { Wallet, ChevronDown, ExternalLink, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function WalletConnection() {
  const [isConnected, setIsConnected] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const connectWallet = () => {
    // Simulate wallet connection
    setIsConnected(true)
    setWalletAddress("0x1234...5678")
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress("")
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress.replace("...", ""))
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 shadow-lg">
      {!isConnected ? (
        <Button
          onClick={connectWallet}
          className="group flex items-center gap-2 bg-[#4f46e5] transition-all duration-300 hover:bg-[#4338ca] hover:shadow-[0_0_10px_rgba(79,70,229,0.5)]"
        >
          <Wallet className="h-5 w-5" />
          <span className="transition-transform duration-300 group-hover:scale-105">Connect Wallet</span>
        </Button>
      ) : (
        <TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
              >
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>{walletAddress}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 border-gray-700 bg-gray-800 text-white">
              <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="flex cursor-pointer items-center justify-between hover:bg-gray-700">
                <span>View on Explorer</span>
                <ExternalLink className="h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex cursor-pointer items-center justify-between hover:bg-gray-700"
                onClick={copyAddress}
              >
                <span>Copy Address</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isCopied ? "Copied!" : "Copy to clipboard"}</p>
                  </TooltipContent>
                </Tooltip>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-700" onClick={disconnectWallet}>
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
      )}
    </div>
  )
}
