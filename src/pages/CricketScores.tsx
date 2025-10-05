import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Clock, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Match {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  teamInfo: Array<{
    name: string;
    shortname: string;
    img: string;
  }>;
  score: Array<{
    r: number;
    w: number;
    o: number;
    inning: string;
  }>;
  series_id: string;
  fantasyEnabled: boolean;
  bbbEnabled: boolean;
  hasSquad: boolean;
  matchStarted: boolean;
  matchEnded: boolean;
}

const CricketScores = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchMatches = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    
    try {
      // Using CricAPI with real API key
      const response = await fetch('https://api.cricapi.com/v1/currentMatches?apikey=b40ef1eb-9e1c-4803-b0f2-6ca2a240a54a&offset=0');
      
      if (!response.ok) {
        throw new Error('Failed to fetch cricket data');
      }
      
      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        setMatches(data.data);
        if (isRefresh) {
          toast({
            title: "Success",
            description: "Cricket scores updated successfully!",
          });
        }
      } else {
        // Demo data for when API is not available
        const demoMatches: Match[] = [
          {
            id: '1',
            name: 'India vs Australia, 1st Test',
            matchType: 'Test',
            status: 'Live',
            venue: 'Melbourne Cricket Ground',
            date: '2024-01-20',
            dateTimeGMT: '2024-01-20T04:30:00Z',
            teams: ['India', 'Australia'],
            teamInfo: [
              { name: 'India', shortname: 'IND', img: '' },
              { name: 'Australia', shortname: 'AUS', img: '' }
            ],
            score: [
              { r: 285, w: 8, o: 90.2, inning: 'India 1st Inn' },
              { r: 156, w: 4, o: 45.3, inning: 'Australia 1st Inn' }
            ],
            series_id: 'test-series-1',
            fantasyEnabled: true,
            bbbEnabled: true,
            hasSquad: true,
            matchStarted: true,
            matchEnded: false
          },
          {
            id: '2',
            name: 'England vs Pakistan, 2nd ODI',
            matchType: 'ODI',
            status: 'Upcoming',
            venue: 'Lord\'s Cricket Ground',
            date: '2024-01-21',
            dateTimeGMT: '2024-01-21T13:30:00Z',
            teams: ['England', 'Pakistan'],
            teamInfo: [
              { name: 'England', shortname: 'ENG', img: '' },
              { name: 'Pakistan', shortname: 'PAK', img: '' }
            ],
            score: [],
            series_id: 'odi-series-1',
            fantasyEnabled: true,
            bbbEnabled: false,
            hasSquad: true,
            matchStarted: false,
            matchEnded: false
          },
          {
            id: '3',
            name: 'South Africa vs New Zealand, T20I',
            matchType: 'T20I',
            status: 'Completed',
            venue: 'Newlands, Cape Town',
            date: '2024-01-19',
            dateTimeGMT: '2024-01-19T16:00:00Z',
            teams: ['South Africa', 'New Zealand'],
            teamInfo: [
              { name: 'South Africa', shortname: 'SA', img: '' },
              { name: 'New Zealand', shortname: 'NZ', img: '' }
            ],
            score: [
              { r: 178, w: 6, o: 20, inning: 'South Africa' },
              { r: 165, w: 8, o: 20, inning: 'New Zealand' }
            ],
            series_id: 't20-series-1',
            fantasyEnabled: true,
            bbbEnabled: true,
            hasSquad: true,
            matchStarted: true,
            matchEnded: true
          }
        ];
        setMatches(demoMatches);
      }
    } catch (error) {
      console.error('Error fetching cricket data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cricket scores. Showing demo data.",
        variant: "destructive",
      });
      
      // Fallback to demo data
      const demoMatches: Match[] = [
        {
          id: '1',
          name: 'India vs Australia, 1st Test',
          matchType: 'Test',
          status: 'Live',
          venue: 'Melbourne Cricket Ground',
          date: '2024-01-20',
          dateTimeGMT: '2024-01-20T04:30:00Z',
          teams: ['India', 'Australia'],
          teamInfo: [
            { name: 'India', shortname: 'IND', img: '' },
            { name: 'Australia', shortname: 'AUS', img: '' }
          ],
          score: [
            { r: 285, w: 8, o: 90.2, inning: 'India 1st Inn' },
            { r: 156, w: 4, o: 45.3, inning: 'Australia 1st Inn' }
          ],
          series_id: 'test-series-1',
          fantasyEnabled: true,
          bbbEnabled: true,
          hasSquad: true,
          matchStarted: true,
          matchEnded: false
        }
      ];
      setMatches(demoMatches);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'Live': 'bg-red-500 text-white',
      'Upcoming': 'bg-blue-500 text-white',
      'Completed': 'bg-green-500 text-white',
      'default': 'bg-gray-500 text-white'
    };
    
    return statusColors[status as keyof typeof statusColors] || statusColors.default;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Helmet>
        <title>Live Cricket Scores - PulseIndia</title>
        <meta name="description" content="Get live cricket scores, match updates, and results from matches worldwide. Stay updated with the latest cricket action." />
        <link rel="canonical" href={`${window.location.origin}/cricket-scores`} />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">Live Cricket Scores</h1>
                <p className="text-lg text-muted-foreground">
                  Stay updated with live cricket matches from around the world
                </p>
              </div>
              
              <Button
                onClick={() => fetchMatches(true)}
                disabled={refreshing}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded"></div>
                        <div className="h-3 bg-muted rounded w-5/6"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {matches.map((match) => (
                  <Link key={match.id} to={`/match/${match.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight mb-2">
                            {match.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Trophy className="h-3 w-3" />
                            <span>{match.matchType}</span>
                          </div>
                        </div>
                        <Badge className={`${getStatusBadge(match.status)} text-xs`}>
                          {match.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {match.score && match.score.length > 0 ? (
                        <div className="space-y-3">
                          {match.score.map((scoreData, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
                              <div className="font-medium text-sm">{scoreData.inning}</div>
                              <div className="text-sm font-mono">
                                {scoreData.r}/{scoreData.w} ({scoreData.o} ov)
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          {match.status === 'Upcoming' ? 'Match not started' : 'No score available'}
                        </div>
                      )}
                      
                      <div className="mt-4 pt-3 border-t space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(match.dateTimeGMT)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground truncate" title={match.venue}>
                          📍 {match.venue}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  </Link>
                ))}
              </div>
            )}

            {!loading && matches.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Matches Available</h3>
                  <p className="text-muted-foreground">
                    There are no cricket matches scheduled at the moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CricketScores;
