"use client"

import { useState } from "react"
import { ChevronDown, Filter, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample transaction data
const transactions = [
  {
    id: "tx1",
    type: "swap",
    from: "ETH",
    to: "TOKEN",
    amount: "0.5",
    value: "500",
    status: "completed",
    timestamp: "2023-05-04T10:30:00Z",
  },
  {
    id: "tx2",
    type: "buy",
    from: "USD",
    to: "TOKEN",
    amount: "100",
    value: "2000",
    status: "completed",
    timestamp: "2023-05-03T14:20:00Z",
  },
  {
    id: "tx3",
    type: "swap",
    from: "TOKEN",
    to: "ETH",
    amount: "200",
    value: "0.2",
    status: "pending",
    timestamp: "2023-05-04T09:15:00Z",
  },
  {
    id: "tx4",
    type: "buy",
    from: "USD",
    to: "TOKEN",
    amount: "50",
    value: "1000",
    status: "failed",
    timestamp: "2023-05-02T11:45:00Z",
  },
  {
    id: "tx5",
    type: "swap",
    from: "BTC",
    to: "TOKEN",
    amount: "0.01",
    value: "1500",
    status: "completed",
    timestamp: "2023-05-01T16:30:00Z",
  },
]

export function TransactionHistory() {
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null)
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["swap", "buy"])

  const toggleTransaction = (id: string) => {
    if (expandedTransaction === id) {
      setExpandedTransaction(null)
    } else {
      setExpandedTransaction(id)
    }
  }

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
  }

  const filteredTransactions = transactions.filter((tx) => selectedTypes.includes(tx.type))

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return (
      date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      " at " +
      date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "failed":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  return (
    <Card className="border-gray-800 bg-gray-900 text-white shadow-xl">
      <CardHeader className="border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Transaction History</CardTitle>
            <CardDescription className="text-gray-400">Your recent transactions</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 border-gray-700 bg-gray-800 hover:bg-gray-700"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-gray-700 bg-gray-800 text-white">
                <DropdownMenuCheckboxItem
                  checked={selectedTypes.includes("swap")}
                  onCheckedChange={() => toggleType("swap")}
                >
                  Swaps
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedTypes.includes("buy")}
                  onCheckedChange={() => toggleType("buy")}
                >
                  Purchases
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-0">
            <div className="divide-y divide-gray-800">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <div key={tx.id} className="transition-colors duration-200 hover:bg-gray-800/50">
                    <div
                      className="flex cursor-pointer items-center justify-between p-4"
                      onClick={() => toggleTransaction(tx.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800">
                          {tx.type === "swap" ? (
                            <ArrowUpRight className="h-5 w-5 text-[#4f46e5]" />
                          ) : (
                            <ArrowDownLeft className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {tx.type === "swap" ? `Swap ${tx.from} to ${tx.to}` : `Buy ${tx.to}`}
                          </p>
                          <p className="text-sm text-gray-400">{formatDate(tx.timestamp)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-medium">
                            {tx.type === "swap"
                              ? `${tx.amount} ${tx.from} → ${tx.value} ${tx.to}`
                              : `$${tx.amount} → ${tx.value} ${tx.to}`}
                          </p>
                          <Badge variant="outline" className={`${getStatusColor(tx.status)}`}>
                            {tx.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                            {tx.status}
                          </Badge>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${expandedTransaction === tx.id ? "rotate-180" : ""}`}
                        />
                      </div>
                    </div>

                    {expandedTransaction === tx.id && (
                      <div className="border-t border-gray-800 bg-gray-800/30 p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Transaction ID</p>
                            <p className="font-mono">{tx.id}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Date & Time</p>
                            <p>{formatDate(tx.timestamp)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">From</p>
                            <p>{tx.from}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">To</p>
                            <p>{tx.to}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Amount</p>
                            <p>
                              {tx.amount} {tx.from}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Value</p>
                            <p>
                              {tx.value} {tx.to}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Status</p>
                            <Badge variant="outline" className={`${getStatusColor(tx.status)}`}>
                              {tx.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm" className="border-gray-700 bg-gray-800 hover:bg-gray-700">
                            View on Explorer
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <p>No transactions found with the selected filters.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="pending" className="mt-0">
            <div className="divide-y divide-gray-800">
              {filteredTransactions.filter((tx) => tx.status === "pending").length > 0 ? (
                filteredTransactions
                  .filter((tx) => tx.status === "pending")
                  .map((tx) => (
                    <div key={tx.id} className="transition-colors duration-200 hover:bg-gray-800/50">
                      <div
                        className="flex cursor-pointer items-center justify-between p-4"
                        onClick={() => toggleTransaction(tx.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800">
                            {tx.type === "swap" ? (
                              <ArrowUpRight className="h-5 w-5 text-[#4f46e5]" />
                            ) : (
                              <ArrowDownLeft className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {tx.type === "swap" ? `Swap ${tx.from} to ${tx.to}` : `Buy ${tx.to}`}
                            </p>
                            <p className="text-sm text-gray-400">{formatDate(tx.timestamp)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-medium">
                              {tx.type === "swap"
                                ? `${tx.amount} ${tx.from} → ${tx.value} ${tx.to}`
                                : `$${tx.amount} → ${tx.value} ${tx.to}`}
                            </p>
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                              <Clock className="mr-1 h-3 w-3" />
                              pending
                            </Badge>
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 transition-transform ${expandedTransaction === tx.id ? "rotate-180" : ""}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <p>No pending transactions found.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="completed" className="mt-0">
            <div className="divide-y divide-gray-800">
              {filteredTransactions.filter((tx) => tx.status === "completed").length > 0 ? (
                filteredTransactions
                  .filter((tx) => tx.status === "completed")
                  .map((tx) => (
                    <div key={tx.id} className="transition-colors duration-200 hover:bg-gray-800/50">
                      <div
                        className="flex cursor-pointer items-center justify-between p-4"
                        onClick={() => toggleTransaction(tx.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800">
                            {tx.type === "swap" ? (
                              <ArrowUpRight className="h-5 w-5 text-[#4f46e5]" />
                            ) : (
                              <ArrowDownLeft className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {tx.type === "swap" ? `Swap ${tx.from} to ${tx.to}` : `Buy ${tx.to}`}
                            </p>
                            <p className="text-sm text-gray-400">{formatDate(tx.timestamp)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-medium">
                              {tx.type === "swap"
                                ? `${tx.amount} ${tx.from} → ${tx.value} ${tx.to}`
                                : `$${tx.amount} → ${tx.value} ${tx.to}`}
                            </p>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              completed
                            </Badge>
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 transition-transform ${expandedTransaction === tx.id ? "rotate-180" : ""}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <p>No completed transactions found.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
