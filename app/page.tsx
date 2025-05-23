import { HeroSection } from "@/components/hero-section"
import { Categories } from "@/components/categories"
import { FeaturedProductsSection } from "@/components/featured-products-section"
import { TrendingSection } from "@/components/trending-products"
import { Newsletter } from "@/components/newsletter"
import { AiRecommendations } from "@/components/ai-recommendations"
import { SustainabilitySection } from "@/components/sustainability-section"
import { Testimonials } from "@/components/testimonials"
import { ShopTheRoom } from "@/components/shop-the-room"
import { AnimatedBanner } from "@/components/animated-banner"
import { ChatBot } from "@/components/chat-bot"

export default function Home() {
  return (
    <div className="flex flex-col gap-8 md:gap-16 pb-16">
      <HeroSection />
      <Categories />
      <FeaturedProductsSection />
      <AnimatedBanner />
      <ShopTheRoom />
      <TrendingSection />
      <Testimonials />
      <SustainabilitySection />
      <AiRecommendations />
      <Newsletter />
      <ChatBot />
    </div>
  )
}
