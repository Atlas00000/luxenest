"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

const slides = [
  {
    id: 1,
    title: "Elevate Your Living Space",
    description:
      "Discover premium furniture and decor that transforms your home into a sanctuary of style and comfort.",
    image: "/images/hero/slide1.jpg",
    cta: "Shop Collection",
    link: "/products",
    color: "from-amber-500/20 via-rose-500/10 to-purple-500/20",
  },
  {
    id: 2,
    title: "Artisan Crafted Luxury",
    description: "Each piece tells a story of craftsmanship and attention to detail, bringing character to your home.",
    image: "/images/hero/slide2.jpg",
    cta: "Explore Artisan",
    link: "/artisan",
    color: "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
  },
  {
    id: 3,
    title: "Sustainable Living",
    description: "Eco-friendly materials and ethical production methods for a beautiful home and a better planet.",
    image: "/images/hero/slide3.jpg",
    cta: "Shop Sustainable",
    link: "/sustainable",
    color: "from-blue-500/20 via-indigo-500/10 to-violet-500/20",
  },
]

export function HeroSection() {
  const [current, setCurrent] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.section ref={containerRef} style={{ opacity }} className="relative w-full h-[100vh] overflow-hidden">
      <AnimatePresence mode="wait">
        {slides.map(
          (slide, index) =>
            index === current && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${slide.color} mix-blend-multiply`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                />
                <motion.div style={{ scale }} className="absolute inset-0">
                  <Image
                    src={slide.image || "/placeholder.svg"}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />

                <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-24 md:pb-32">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="max-w-2xl space-y-6"
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "3rem" }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-1 bg-primary"
                    />
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                      {slide.title.split(" ").map((word, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                          className="inline-block mr-3"
                        >
                          {word}
                        </motion.span>
                      ))}
                    </h1>
                    <motion.p
                      className="text-lg md:text-xl text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 1 }}
                    >
                      {slide.description}
                    </motion.p>
                    <motion.div
                      className="pt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.2 }}
                    >
                      <Button asChild size="lg" className="group relative overflow-hidden">
                        <Link href={slide.link}>
                          <span className="relative z-10 flex items-center">
                            {slide.cta}
                            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                          <motion.div
                            className="absolute inset-0 bg-primary"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.4 }}
                          />
                        </Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            ),
        )}
      </AnimatePresence>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === current ? "bg-primary w-8" : "bg-primary/30"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <motion.div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ y }} />
    </motion.section>
  )
}
