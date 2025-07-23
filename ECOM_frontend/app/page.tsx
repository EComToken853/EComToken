"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useAnimation, useInView } from "framer-motion"
import { ArrowRight, CheckCircle, Globe, Zap, ShieldCheck, DollarSign, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedBackground } from "@/components/animated-background"
import { AnimatedCounter } from "@/components/animated-counter"
import { TokenAnimation } from "@/components/token-animation"

export default function LandingPage() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const features = [
    {
      icon: <DollarSign className="h-6 w-6 text-[#4f46e5]" />,
      title: "0.25% Transaction Fee",
      description: "vs 3-5% industry standard, saving merchants thousands annually",
    },
    {
      icon: <Zap className="h-6 w-6 text-[#4f46e5]" />,
      title: "Instant Settlements",
      description: "No more waiting 3-5 business days for payment processing",
    },
    {
      icon: <Globe className="h-6 w-6 text-[#4f46e5]" />,
      title: "Global Payments",
      description: "Eliminate cross-border fees and currency conversion costs",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-[#4f46e5]" />,
      title: "Fraud Protection",
      description: "Immutable blockchain records and escrow smart contracts",
    },
  ]

  return (
    <div className="relative flex min-h-screen flex-col bg-[#1a1a1a] text-white overflow-hidden">
      <AnimatedBackground />

      {/* Hero Section */}
      <div className="container relative z-10 mx-auto flex max-w-[1200px] flex-col items-center justify-center px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-block rounded-full bg-[#4f46e5]/20 px-4 py-1 text-sm font-medium text-[#4f46e5]">
            Revolutionizing E-Commerce Payments
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
        >
          ECom Token Platform
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12 max-w-[700px] text-lg text-[#94a3b8] sm:text-xl"
        >
          The blockchain solution eliminating payment barriers in global e-commerce with near-zero fees, instant
          settlements, and built-in fraud protection.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/dashboard">
            <Button className="group relative overflow-hidden rounded-lg bg-[#4f46e5] px-8 py-6 text-lg font-medium text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              <span className="relative z-10 flex items-center gap-2 transition-transform duration-300 group-hover:scale-110">
                Launch App <ArrowRight className="h-5 w-5" />
              </span>
            </Button>
          </Link>
          <Link href="#learn-more">
            <Button variant="outline" className="px-8 py-6 text-lg border-gray-700 bg-transparent hover:bg-gray-800">
              Learn More
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 w-full bg-gradient-to-b from-[#1a1a1a] to-[#111111] py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center justify-center rounded-lg bg-gray-800/30 p-6 text-center"
            >
              <span className="text-4xl font-bold text-[#4f46e5]">
                <AnimatedCounter from={0} to={97} duration={2} />%
              </span>
              <span className="mt-2 text-sm text-gray-400">CHEAPER THAN CREDIT CARDS</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center justify-center rounded-lg bg-gray-800/30 p-6 text-center"
            >
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-[#4f46e5]">
                  <AnimatedCounter from={0} to={7} duration={2} />
                </span>
                <span className="text-4xl font-bold text-[#4f46e5]">.</span>
                <span className="text-4xl font-bold text-[#4f46e5]">
                  <AnimatedCounter from={0} to={8} duration={2} />
                </span>
                <span className="text-xl font-bold text-white ml-1">s</span>
              </div>
              <span className="mt-2 text-sm text-gray-400">AVERAGE TRANSACTION TIME</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-center justify-center rounded-lg bg-gray-800/30 p-6 text-center"
            >
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-[#4f46e5]">$</span>
                <span className="text-4xl font-bold text-[#4f46e5]">
                  <AnimatedCounter from={0} to={400} duration={2} />
                </span>
                <span className="text-xl font-bold text-white ml-1">K+</span>
              </div>
              <span className="mt-2 text-sm text-gray-400">ANNUAL SAVINGS PER $10M MERCHANT</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Token Visualization */}
      <div id="learn-more" className="relative z-10 py-20 bg-[#111111]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
                  The Visa/Mastercard Alternative for Web3 E-commerce
                </h2>
                <p className="mb-6 text-gray-400">
                  ECom Token is an ERC20 token designed specifically for e-commerce transactions, eliminating
                  unnecessary fees while enabling truly global trade.
                </p>
                <ul className="space-y-4">
                  {[
                    "Fixed supply of 100M tokens (anti-inflationary)",
                    "Built on Ethereum with OpenZeppelin audited contracts",
                    "Merchant DAO governance (coming 2025)",
                    "Compatible with Shopify, WooCommerce & more",
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
            <div className="flex justify-center">
              <TokenAnimation />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20 bg-gradient-to-b from-[#111111] to-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={containerVariants}
            className="text-center mb-12"
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-4">
              E-Commerce Optimized Features
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-400 max-w-2xl mx-auto">
              Unlike generic tokens, ECom Token is purpose-built for e-commerce with features that solve real-world
              payment challenges.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants} className="group">
                <Card className="h-full border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#4f46e5]/10 group-hover:bg-[#4f46e5]/20 transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="relative z-10 py-20 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Merchant-Centric Economics</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              See how ECom Token compares to traditional payment methods
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="overflow-x-auto"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-4 px-6 text-left">Feature</th>
                  <th className="py-4 px-6 text-left text-[#4f46e5]">ECom Token</th>
                  <th className="py-4 px-6 text-left text-gray-400">Competitors</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-6">Settlement Time</td>
                  <td className="py-4 px-6 font-medium">Instant</td>
                  <td className="py-4 px-6 text-gray-400">3-5 business days</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-6">Chargeback Fraud</td>
                  <td className="py-4 px-6 font-medium">0%</td>
                  <td className="py-4 px-6 text-gray-400">2-3% of revenue</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-6">Cross-Border Fees</td>
                  <td className="py-4 px-6 font-medium">0.25%</td>
                  <td className="py-4 px-6 text-gray-400">3-5% + FX fees</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="relative z-10 py-20 bg-gradient-to-b from-[#1a1a1a] to-[#111111]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">6-Month Goals</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Our roadmap to revolutionize e-commerce payments</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#4f46e5]/10">
                    <BarChart3 className="h-8 w-8 text-[#4f46e5]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">500+</h3>
                  <p className="text-gray-400">Integrated Merchants</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="h-full border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#4f46e5]/10">
                    <DollarSign className="h-8 w-8 text-[#4f46e5]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">$10M+</h3>
                  <p className="text-gray-400">Processed Volume</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="h-full border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#4f46e5]/10">
                    <Globe className="h-8 w-8 text-[#4f46e5]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">3+</h3>
                  <p className="text-gray-400">Exchange Listings</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-20 bg-[#111111]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#7b71e3] p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your E-Commerce Payments?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Join the revolution and save up to 5% on every transaction while providing a seamless experience for your
              customers.
            </p>
            <Link href="/dashboard">
              <Button className="group relative overflow-hidden rounded-lg bg-white text-[#4f46e5] px-8 py-6 text-lg font-medium transition-all duration-300 hover:bg-gray-100">
                <span className="relative z-10 flex items-center gap-2 transition-transform duration-300 group-hover:scale-110">
                  Launch Platform <ArrowRight className="h-5 w-5" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
