import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import PricingSection from "@/components/home/PricingSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import FeaturedDesigns from "@/components/FeaturedDesigns";

const HomePage = () => {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <FeaturedDesigns />
      <HowItWorksSection />
      <PricingSection />
      <NewsletterSection />
    </div>
  );
};

export default HomePage;
