"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Leaf, Recycle, Droplets } from "lucide-react"

export function SustainabilitySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, 100])

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Sustainability background"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10" />
      </div>

      <motion.div className="container mx-auto px-4" style={{ opacity, y }}>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Sustainable Living</h2>
          <p className="text-lg text-muted-foreground">
            We're committed to creating beautiful products that don't compromise our planet's future. Discover our
            eco-friendly collections and join us in making a difference.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            className="bg-background/80 backdrop-blur-sm rounded-xl p-6 border"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Sustainable Materials</h3>
            <p className="text-muted-foreground mb-4">
              We source responsibly harvested wood, organic textiles, and recycled materials to create products that are
              as kind to the planet as they are beautiful.
            </p>
            <Button variant="link" asChild className="p-0">
              <Link href="/sustainability">Learn more</Link>
            </Button>
          </motion.div>

          <motion.div
            className="bg-background/80 backdrop-blur-sm rounded-xl p-6 border"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Recycle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Circular Design</h3>
            <p className="text-muted-foreground mb-4">
              Our products are designed to last, with timeless aesthetics and durable construction. When they've served
              their purpose, many can be recycled or biodegraded.
            </p>
            <Button variant="link" asChild className="p-0">
              <Link href="/sustainability">Learn more</Link>
            </Button>
          </motion.div>

          <motion.div
            className="bg-background/80 backdrop-blur-sm rounded-xl p-6 border"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Droplets className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Water Conservation</h3>
            <p className="text-muted-foreground mb-4">
              Our manufacturing processes are designed to minimize water usage and prevent pollution, protecting this
              precious resource for future generations.
            </p>
            <Button variant="link" asChild className="p-0">
              <Link href="/sustainability">Learn more</Link>
            </Button>
          </motion.div>
        </div>

        <div className="mt-12 text-center">
          <Button asChild>
            <Link href="/sustainability">Explore Our Sustainable Collection</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
