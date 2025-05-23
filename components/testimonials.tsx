"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Emma Thompson",
    role: "Interior Designer",
    image: "/placeholder.svg?height=100&width=100",
    quote:
      "LuxeNest has transformed how I approach client projects. The quality and design of each piece exceeds expectations, and the sustainable options align perfectly with my eco-conscious clients.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Homeowner",
    image: "/placeholder.svg?height=100&width=100",
    quote:
      "After renovating our home, we wanted furniture that would last for years. The craftsmanship of LuxeNest pieces is exceptional, and their customer service made the experience even better.",
  },
  {
    id: 3,
    name: "Sophia Rodriguez",
    role: "Architect",
    image: "/placeholder.svg?height=100&width=100",
    quote:
      "I recommend LuxeNest to all my clients. Their attention to detail and commitment to sustainable practices sets them apart in the industry. Truly exceptional quality.",
  },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay])

  const next = () => {
    setAutoplay(false)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setAutoplay(false)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "2rem" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="h-0.5 bg-primary"
            />
            <span className="text-sm text-primary font-medium uppercase tracking-wider">Testimonials</span>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "2rem" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="h-0.5 bg-primary"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What Our Clients Say</h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {testimonials.map(
              (testimonial, index) =>
                index === current && (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="bg-background rounded-2xl p-8 md:p-12 shadow-sm border"
                  >
                    <Quote className="h-12 w-12 text-primary/20 mb-6" />

                    <blockquote className="text-xl md:text-2xl font-medium italic mb-8">
                      "{testimonial.quote}"
                    </blockquote>

                    <div className="flex items-center">
                      <div className="relative h-14 w-14 rounded-full overflow-hidden mr-4">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </motion.div>
                ),
            )}
          </AnimatePresence>

          <div className="flex justify-center mt-8 gap-2">
            <Button variant="outline" size="icon" onClick={prev} className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setAutoplay(false)
                    setCurrent(index)
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === current ? "bg-primary w-8" : "bg-primary/30"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={next} className="rounded-full">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
