import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedVehicles from '@/components/home/FeaturedVehicles';
import HowItWorks from '@/components/home/HowItWorks';
import WhyChoose from '@/components/home/WhyChoose';
import VendorCTA from '@/components/home/VendorCTA';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedVehicles />
        <HowItWorks />
        <WhyChoose />
        <VendorCTA />
      </main>
      <Footer />
    </div>
  );
}
