import { useEffect } from "react";
import { Header } from "@/components/Header";
import { BlogList } from "@/components/BlogList";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";

// AdSense Component
const AdSenseAd = ({ slot }: { slot: string }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-ad-client", "ca-pub-9494325056615840");
    document.body.appendChild(script);

    // Initialize ad after script loads
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-9494325056615840"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

const Index = () => {
  return (
    <>
      <Helmet>
        <title>PulseIndia - Latest Indian News & Updates</title>
        <meta
          name="description"
          content="Stay updated with the latest Indian news, breaking stories, and current affairs. PulseIndia brings you automated news updates every 2 minutes."
        />
        <meta
          name="keywords"
          content="India news, breaking news, current affairs, Indian updates, latest news"
        />
        <meta property="og:title" content="PulseIndia - Latest Indian News & Updates" />
        <meta
          property="og:description"
          content="Stay updated with the latest Indian news, breaking stories, and current affairs."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Latest India's News</h1>
                <p className="text-base lg:text-lg text-muted-foreground">
                  Stay updated with the latest breaking news and current affairs from India
                </p>
              </div>

              {/* AdSense at the top of BlogList */}
              <div className="mb-6">
                <AdSenseAd slot="YOUR_AD_SLOT_HERE" />
              </div>

              <BlogList />

              {/* AdSense at the bottom of BlogList */}
              <div className="mt-6">
                <AdSenseAd slot="YOUR_AD_SLOT_HERE" />
              </div>
            </div>

            <aside className="w-full lg:w-80">
              <Sidebar />
            </aside>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
