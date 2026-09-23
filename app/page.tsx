import Hero from "@/components/Hero";
import RangeSection from "@/components/RangeSection";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import Simulator from "@/components/simulator/Simulator";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Simulator />
        <RangeSection />
      </main>
      <SiteFooter />
    </>
  );
}
