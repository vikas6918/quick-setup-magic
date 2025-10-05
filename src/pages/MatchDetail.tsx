import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";

const MatchDetail = () => {
  const { matchId } = useParams();

  return (
    <>
      <Helmet>
        <title>Match Details - PulseIndia</title>
        <meta name="description" content="Live cricket match details and scores" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="container mx-auto px-4 py-8 flex-1">
          <h1 className="text-3xl font-bold mb-6">Cricket Match Details</h1>
          <p className="text-muted-foreground">Match ID: {matchId}</p>
          <p className="mt-4">Cricket match details coming soon...</p>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MatchDetail;
