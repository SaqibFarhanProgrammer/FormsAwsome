import { FeaturesGrid } from "@/components/LandingPage/FeaturesGrid";
import { CTAFooter } from "@/components/LandingPage/Footer";
import { HeroSection } from "@/components/LandingPage/Hero";
import { HowItWorks } from "@/components/LandingPage/HowitWorks";
import { Navbar } from "@/components/LandingPage/Navbar";
import { PricingSection } from "@/components/LandingPage/PricingSections";
import { SocialProof } from "@/components/LandingPage/SociaProof";
import { Testimonials } from "@/components/LandingPage/Testimonials";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <SocialProof />
      <FeaturesGrid />
      <HowItWorks />
      <Testimonials />
      <PricingSection />
      <CTAFooter />
    </div>
  );
}
