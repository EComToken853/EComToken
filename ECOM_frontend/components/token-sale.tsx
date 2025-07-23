"use client"

import { useState } from "react"
import { Clock, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function TokenSale() {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Token sale data
  const totalRaised = 7500000
  const hardCap = 10000000
  const percentageRaised = (totalRaised / hardCap) * 100

  const handleBuy = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setAmount("")
    }, 2000)
  }

  return (
    <Card className="h-full border-gray-800 bg-gray-900 text-white shadow-xl">
      <CardHeader className="border-b border-gray-800 pb-4">
        <CardTitle className="text-xl font-bold">Token Sale</CardTitle>
        <CardDescription className="text-gray-400">Participate in our token sale</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">Sale Progress</h3>
            <div className="flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-yellow-400">
              <Clock className="h-3 w-3" />
              <span>2d 14h 35m left</span>
            </div>
          </div>

          <Progress value={percentageRaised} className="h-2 bg-gray-800" indicatorClassName="bg-[#4f46e5]" />

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Raised</span>
            <span className="font-medium text-yellow-400">${totalRaised.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Hard Cap</span>
            <span className="font-medium">${hardCap.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-4 rounded-lg bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Token Price</h3>
            <span className="text-yellow-400">$0.05</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-md border border-gray-700 p-2">
              <p className="text-gray-400">Tier 1</p>
              <p className="font-medium">$0.04</p>
            </div>
            <div className="rounded-md border border-gray-700 bg-[#4f46e5] p-2">
              <p className="text-gray-300">Tier 2</p>
              <p className="font-medium">$0.05</p>
            </div>
            <div className="rounded-md border border-gray-700 p-2">
              <p className="text-gray-400">Tier 3</p>
              <p className="font-medium">$0.06</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Min. Purchase</span>
            <span>$50</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Max. Purchase</span>
            <span>$50,000</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex w-full items-center gap-2">
          <Input
            type="number"
            placeholder="Amount in USD"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-[#4f46e5]"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="border-gray-700 bg-gray-800 hover:bg-gray-700">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Enter amount in USD to purchase tokens</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Button
          onClick={handleBuy}
          disabled={!amount || isLoading}
          className="w-full bg-[#4f46e5] text-white transition-all duration-300 hover:bg-[#4338ca] hover:shadow-[0_0_10px_rgba(79,70,229,0.5)]"
        >
          {isLoading ? "Processing..." : "Buy Tokens"}
        </Button>
      </CardFooter>
    </Card>
  )
}
