import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Horoscope {
  sign: string;
  hindiName: string;
  date: string;
  horoscope: string;
  color: string;
  luckyNumber: string;
  luckyTime: string;
  mood: string;
}

const zodiacSigns = [
  { name: "aries", hindi: "मेष", icon: "♈", color: "from-red-500 to-orange-500" },
  { name: "taurus", hindi: "वृषभ", icon: "♉", color: "from-green-500 to-emerald-500" },
  { name: "gemini", hindi: "मिथुन", icon: "♊", color: "from-yellow-500 to-amber-500" },
  { name: "cancer", hindi: "कर्क", icon: "♋", color: "from-blue-500 to-cyan-500" },
  { name: "leo", hindi: "सिंह", icon: "♌", color: "from-orange-500 to-red-500" },
  { name: "virgo", hindi: "कन्या", icon: "♍", color: "from-green-600 to-teal-500" },
  { name: "libra", hindi: "तुला", icon: "♎", color: "from-pink-500 to-rose-500" },
  { name: "scorpio", hindi: "वृश्चिक", icon: "♏", color: "from-purple-500 to-indigo-500" },
  { name: "sagittarius", hindi: "धनु", icon: "♐", color: "from-violet-500 to-purple-500" },
  { name: "capricorn", hindi: "मकर", icon: "♑", color: "from-slate-600 to-gray-600" },
  { name: "aquarius", hindi: "कुंभ", icon: "♒", color: "from-cyan-500 to-blue-500" },
  { name: "pisces", hindi: "मीन", icon: "♓", color: "from-indigo-500 to-blue-500" }
];

const Astrology = () => {
  const [horoscopes, setHoroscopes] = useState<Horoscope[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchHoroscopes = async () => {
    try {
      const promises = zodiacSigns.map(async (sign) => {
        try {
          const response = await fetch(`https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign.name}&day=today`);
          
          if (!response.ok) {
            throw new Error('API request failed');
          }
          
          const data = await response.json();
          
          return {
            sign: sign.name.charAt(0).toUpperCase() + sign.name.slice(1),
            hindiName: sign.hindi,
            date: data.data?.date || new Date().toLocaleDateString(),
            horoscope: data.data?.horoscope_data || "Your stars are aligned today. Stay positive and embrace new opportunities.",
            color: sign.color,
            luckyNumber: Math.floor(Math.random() * 99 + 1).toString(),
            luckyTime: `${Math.floor(Math.random() * 12 + 1)}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
            mood: ["Happy", "Energetic", "Calm", "Optimistic", "Focused"][Math.floor(Math.random() * 5)]
          };
        } catch (error) {
          // Fallback data if API fails
          return {
            sign: sign.name.charAt(0).toUpperCase() + sign.name.slice(1),
            hindiName: sign.hindi,
            date: new Date().toLocaleDateString(),
            horoscope: "Your stars are aligned today. Stay positive and embrace new opportunities that come your way.",
            color: sign.color,
            luckyNumber: Math.floor(Math.random() * 99 + 1).toString(),
            luckyTime: `${Math.floor(Math.random() * 12 + 1)}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
            mood: ["Happy", "Energetic", "Calm", "Optimistic", "Focused"][Math.floor(Math.random() * 5)]
          };
        }
      });

      const results = await Promise.all(promises);
      setHoroscopes(results);
    } catch (error) {
      console.error('Error fetching horoscopes:', error);
      toast({
        title: "Error",
        description: "Failed to load horoscopes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHoroscopes();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHoroscopes();
  };

  return (
    <>
      <Helmet>
        <title>Today's Rashifal - Daily Horoscope | PulseIndia</title>
        <meta name="description" content="Get your daily rashifal and horoscope predictions for all zodiac signs. Updated daily with accurate astrology insights, lucky numbers, and mood predictions." />
        <meta name="keywords" content="rashifal, horoscope, daily horoscope, astrology, zodiac signs, राशिफल, आज का राशिफल, today rashifal" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-primary" />
                Today's Rashifal
              </h1>
              <p className="text-muted-foreground">
                Daily horoscope predictions for all zodiac signs - {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing}
              variant="outline"
              size="lg"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(12)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {horoscopes.map((horoscope, index) => (
                <Card key={horoscope.sign} className="hover:shadow-lg transition-shadow">
                  <CardHeader className={`bg-gradient-to-r ${horoscope.color} text-white rounded-t-lg`}>
                    <CardTitle className="flex items-center justify-between">
                      <span>{horoscope.sign}</span>
                      <span className="text-3xl">{zodiacSigns[index].icon}</span>
                    </CardTitle>
                    <CardDescription className="text-white/90">
                      {horoscope.hindiName} • {horoscope.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-foreground mb-4 leading-relaxed">
                      {horoscope.horoscope}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-muted-foreground mb-1">Lucky Number</p>
                        <p className="font-bold text-primary text-lg">{horoscope.luckyNumber}</p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-muted-foreground mb-1">Lucky Time</p>
                        <p className="font-bold text-primary">{horoscope.luckyTime}</p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg col-span-2">
                        <p className="text-muted-foreground mb-1">Mood</p>
                        <p className="font-bold text-primary">{horoscope.mood}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> Astrology predictions are for entertainment purposes only. 
              They should not be used as a substitute for professional advice.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Astrology;
