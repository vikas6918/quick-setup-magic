import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";

const Astrology = () => {
  return (
    <>
      <Helmet>
        <title>Today's Astrology - PulseIndia</title>
        <meta name="description" content="Daily horoscope and astrology predictions" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="container mx-auto px-4 py-8 flex-1">
          <h1 className="text-3xl font-bold mb-6">Today's Astrology</h1>
          <p className="text-muted-foreground">Daily horoscope and astrology predictions coming soon...</p>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Astrology;
