import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";

const TermsConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions - PulseIndia</title>
        <meta name="description" content="Terms and conditions for using PulseIndia news website." />
        <link rel="canonical" href={`${window.location.origin}/terms-conditions`} />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-bold mb-8">Terms & Conditions</h1>
            
            <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using PulseIndia, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Permission is granted to temporarily download one copy of the materials on PulseIndia for personal, non-commercial transitory viewing only.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The materials on PulseIndia are provided on an 'as is' basis. PulseIndia makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Content Accuracy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  While we strive to provide accurate and up-to-date news information, PulseIndia does not warrant the accuracy, completeness, or usefulness of this information. Any reliance you place on such information is strictly at your own risk.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Limitations</h2>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall PulseIndia or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on PulseIndia, even if PulseIndia or its authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Revisions</h2>
                <p className="text-muted-foreground leading-relaxed">
                  PulseIndia may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TermsConditions;
