import { FeaturesGrid } from "@/components/landing-page/FeaturesGrid";
import { CTAFooter } from "@/components/landing-page/Footer";
import { HeroSection } from "@/components/landing-page/Hero";
import { HowItWorks } from "@/components/landing-page/HowitWorks";
import { Navbar } from "@/components/landing-page/Navbar";
import { PricingSection } from "@/components/landing-page/PricingSections";
import { SocialProof } from "@/components/landing-page/SociaProof";
import { Testimonials } from "@/components/landing-page/Testimonials";

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
