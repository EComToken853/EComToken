"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Shield, Smartphone, Mail } from "lucide-react"

export default function TwoFactorAuth() {
  const [otpCode, setOtpCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [error, setError] = useState("")

  const handleVerify = () => {
    setIsVerifying(true)
    setError("")

    // Simulate verification
    setTimeout(() => {
      if (otpCode === "123456") {
        window.location.href = "/dashboard"
      } else {
        setError("Invalid verification code. Please try again.")
        setOtpCode("")

        // Add shake animation by toggling class
        const element = document.getElementById("otp-card")
        element?.classList.add("animate-shake")
        setTimeout(() => {
          element?.classList.remove("animate-shake")
        }, 500)
      }
      setIsVerifying(false)
    }, 1500)
  }

  const handleResend = () => {
    setCooldown(30)
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1a1a1a] p-4 text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card id="otp-card" className="mx-auto w-full max-w-md border-gray-800 bg-gray-900 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Two-Factor Authentication</CardTitle>
            <CardDescription className="text-gray-400">Verify your identity to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="authenticator" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger value="authenticator" className="data-[state=active]:bg-[#4f46e5]">
                  <Shield className="mr-2 h-4 w-4" />
                  TOTP
                </TabsTrigger>
                <TabsTrigger value="sms" className="data-[state=active]:bg-[#4f46e5]">
                  <Smartphone className="mr-2 h-4 w-4" />
                  SMS
                </TabsTrigger>
                <TabsTrigger value="email" className="data-[state=active]:bg-[#4f46e5]">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </TabsTrigger>
              </TabsList>

              <TabsContent value="authenticator" className="mt-6 space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-lg bg-white p-4">
                    <img src="/placeholder.svg?height=200&width=200" alt="QR Code" className="h-[200px] w-[200px]" />
                  </div>
                </div>
                <div className="text-center text-sm text-gray-400">
                  <p>Scan this QR code with your authenticator app</p>
                  <p className="mt-2 font-mono">Or enter code: ABCD1234EFGH5678</p>
                </div>
              </TabsContent>

              <TabsContent value="sms" className="mt-6 space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400">We've sent a verification code to +1 (***) ***-**89</p>
                </div>
              </TabsContent>

              <TabsContent value="email" className="mt-6 space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400">We've sent a verification code to e***@example.com</p>
                </div>
              </TabsContent>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-400">Enter verification code</div>
                  <Input
                    id="otp"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value)
                      setError("")
                    }}
                    className={`border-gray-700 bg-gray-800 text-center text-xl tracking-widest placeholder:text-gray-500 focus-visible:ring-[#4f46e5] ${
                      error ? "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                  />
                  {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500">
                      {error}
                    </motion.p>
                  )}
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="link"
                    size="sm"
                    disabled={cooldown > 0}
                    onClick={handleResend}
                    className="text-gray-400 hover:text-white"
                  >
                    {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                  </Button>
                </div>
              </div>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleVerify}
              disabled={otpCode.length < 6 || isVerifying}
              className="w-full bg-[#4f46e5] text-white transition-all duration-300 hover:bg-[#4338ca] hover:shadow-[0_0_10px_rgba(79,70,229,0.5)]"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Continue"
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
