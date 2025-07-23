"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function TokenAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 400
    canvas.height = 400

    // Token properties
    const tokenRadius = 100
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const orbitalParticles: OrbitalParticle[] = []
    const numParticles = 50

    // Create orbital particles
    class OrbitalParticle {
      angle: number
      radius: number
      speed: number
      size: number
      color: string

      constructor() {
        this.angle = Math.random() * Math.PI * 2
        this.radius = tokenRadius + Math.random() * 80
        this.speed = 0.005 + Math.random() * 0.01
        this.size = 1 + Math.random() * 3
        this.color = "#4f46e5"
      }

      update() {
        this.angle += this.speed
        if (this.angle > Math.PI * 2) {
          this.angle -= Math.PI * 2
        }
      }

      draw() {
        if (!ctx) return
        const x = centerX + Math.cos(this.angle) * this.radius
        const y = centerY + Math.sin(this.angle) * this.radius

        ctx.beginPath()
        ctx.arc(x, y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    // Create particles
    for (let i = 0; i < numParticles; i++) {
      orbitalParticles.push(new OrbitalParticle())
    }

    // Draw token
    function drawToken() {
      if (!ctx) return

      // Outer glow
      const gradient = ctx.createRadialGradient(centerX, centerY, tokenRadius - 10, centerX, centerY, tokenRadius + 20)
      gradient.addColorStop(0, "rgba(79, 70, 229, 0.3)")
      gradient.addColorStop(1, "rgba(79, 70, 229, 0)")

      ctx.beginPath()
      ctx.arc(centerX, centerY, tokenRadius + 20, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Token body
      ctx.beginPath()
      ctx.arc(centerX, centerY, tokenRadius, 0, Math.PI * 2)
      ctx.fillStyle = "#1a1a1a"
      ctx.strokeStyle = "#4f46e5"
      ctx.lineWidth = 3
      ctx.fill()
      ctx.stroke()

      // Token inner design
      ctx.beginPath()
      ctx.arc(centerX, centerY, tokenRadius * 0.8, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(79, 70, 229, 0.3)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Token symbol
      ctx.font = "bold 60px Arial"
      ctx.fillStyle = "#4f46e5"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("EC", centerX, centerY)

      // Token name
      ctx.font = "bold 16px Arial"
      ctx.fillStyle = "white"
      ctx.fillText("ECOM TOKEN", centerX, centerY + 30)
    }

    // Animation loop
    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = 0; i < orbitalParticles.length; i++) {
        orbitalParticles[i].update()
        orbitalParticles[i].draw()
      }

      drawToken()
      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      <canvas ref={canvasRef} width={400} height={400} className="mx-auto" />
    </motion.div>
  )
}
