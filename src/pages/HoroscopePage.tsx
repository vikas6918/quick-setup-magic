import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const zodiacSigns = [
  { name: "Aries", emoji: "♈", slug: "aries" },
  { name: "Taurus", emoji: "♉", slug: "taurus" },
  { name: "Gemini", emoji: "♊", slug: "gemini" },
  { name: "Cancer", emoji: "♋", slug: "cancer" },
  { name: "Leo", emoji: "♌", slug: "leo" },
  { name: "Virgo", emoji: "♍", slug: "virgo" },
  { name: "Libra", emoji: "♎", slug: "libra" },
  { name: "Scorpio", emoji: "♏", slug: "scorpio" },
  { name: "Sagittarius", emoji: "♐", slug: "sagittarius" },
  { name: "Capricorn", emoji: "♑", slug: "capricorn" },
  { name: "Aquarius", emoji: "♒", slug: "aquarius" },
  { name: "Pisces", emoji: "♓", slug: "pisces" },
];

const HoroscopePage = () => {
  const [selectedSign, setSelectedSign] = useState(zodiacSigns[0].slug);
  const today = new Date().toISOString().split("T")[0];

  const { data: horoscope, isLoading } = useQuery({
    queryKey: ["horoscope", selectedSign, today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("horoscopes")
        .select("*")
        .eq("sign", selectedSign)
        .eq("date", today)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-gradient-to-b from-muted/50 to-background py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-5xl font-bold">Daily Horoscope</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Discover what the stars have in store for you today
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {zodiacSigns.map((sign) => (
              <Card
                key={sign.slug}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedSign === sign.slug ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedSign(sign.slug)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">{sign.emoji}</div>
                  <div className="font-semibold">{sign.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ) : horoscope ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl flex items-center space-x-2">
                  <span>
                    {zodiacSigns.find((s) => s.slug === selectedSign)?.emoji}
                  </span>
                  <span>
                    {zodiacSigns.find((s) => s.slug === selectedSign)?.name} Horoscope
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="love">Love</TabsTrigger>
                    <TabsTrigger value="career">Career</TabsTrigger>
                    <TabsTrigger value="health">Health</TabsTrigger>
                    <TabsTrigger value="finance">Finance</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4 mt-6">
                    <p className="text-lg leading-relaxed">{horoscope.horoscope}</p>
                    {horoscope.detailed_horoscope && (
                      <p className="text-muted-foreground">{horoscope.detailed_horoscope}</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      {horoscope.lucky_color && (
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="font-semibold mb-1">Lucky Color</div>
                          <div className="text-primary">{horoscope.lucky_color}</div>
                        </div>
                      )}
                      {horoscope.lucky_number && (
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="font-semibold mb-1">Lucky Number</div>
                          <div className="text-primary">{horoscope.lucky_number}</div>
                        </div>
                      )}
                      {horoscope.lucky_time && (
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="font-semibold mb-1">Lucky Time</div>
                          <div className="text-primary">{horoscope.lucky_time}</div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="love" className="mt-6">
                    <p className="text-lg leading-relaxed">
                      {horoscope.love_advice || "Love advice not available for today."}
                    </p>
                  </TabsContent>

                  <TabsContent value="career" className="mt-6">
                    <p className="text-lg leading-relaxed">
                      {horoscope.career_advice || "Career advice not available for today."}
                    </p>
                  </TabsContent>

                  <TabsContent value="health" className="mt-6">
                    <p className="text-lg leading-relaxed">
                      {horoscope.health_advice || "Health advice not available for today."}
                    </p>
                  </TabsContent>

                  <TabsContent value="finance" className="mt-6">
                    <p className="text-lg leading-relaxed">
                      {horoscope.finance_advice || "Finance advice not available for today."}
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-xl text-muted-foreground">
                  No horoscope available for today. Check back tomorrow!
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HoroscopePage;
