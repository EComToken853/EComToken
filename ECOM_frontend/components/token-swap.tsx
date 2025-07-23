"use client"

import { useState } from "react"
import { ArrowDown, Settings, Info, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function TokenSwap() {
  const [fromAmount, setFromAmount] = useState("")
  const [fromToken, setFromToken] = useState("ETH")
  const [toToken, setToToken] = useState("TOKEN")
  const [isLoading, setIsLoading] = useState(false)

  const handleSwap = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const handleSwitchTokens = () => {
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)
  }

  return (
    <Card className="h-full border-gray-800 bg-gray-900 text-white shadow-xl">
      <CardHeader className="border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Swap Tokens</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Swap Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription className="text-gray-400">Exchange tokens at the best rates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-400">From</label>
            <span className="text-xs text-gray-500">Balance: 0.42 ETH</span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="flex-1 border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-[#4f46e5]"
            />
            <Select value={fromToken} onValueChange={setFromToken}>
              <SelectTrigger className="w-[120px] border-gray-700 bg-gray-800 text-white">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-gray-800 text-white">
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="BTC">BTC</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="TOKEN">TOKEN</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-gray-800 p-2 hover:bg-gray-700"
            onClick={handleSwitchTokens}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-400">To</label>
            <span className="text-xs text-gray-500">Balance: 1000 TOKEN</span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="0.0"
              readOnly
              value={fromAmount ? Number.parseFloat(fromAmount) * 1000 : ""}
              className="flex-1 border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-[#4f46e5]"
            />
            <Select value={toToken} onValueChange={setToToken}>
              <SelectTrigger className="w-[120px] border-gray-700 bg-gray-800 text-white">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-gray-800 text-white">
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="BTC">BTC</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="TOKEN">TOKEN</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg bg-gray-800 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-gray-400">
              Rate
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Exchange rate between tokens</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <span className="font-medium">1 ETH = 1000 TOKEN</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Slippage Tolerance</span>
            <span className="font-medium">0.5%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Network Fee</span>
            <span className="font-medium">~0.001 ETH</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSwap}
          disabled={!fromAmount || isLoading}
          className="w-full bg-[#4f46e5] text-white transition-all duration-300 hover:bg-[#4338ca] hover:shadow-[0_0_10px_rgba(79,70,229,0.5)]"
        >
          {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Swapping..." : "Swap Tokens"}
        </Button>
      </CardFooter>
    </Card>
  )
}
