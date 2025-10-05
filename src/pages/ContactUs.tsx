import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, Phone } from "lucide-react";

const ContactUs = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - PulseIndia</title>
        <meta name="description" content="Get in touch with PulseIndia team. Contact us for news tips, feedback, or any inquiries." />
        <link rel="canonical" href={`${window.location.origin}/contact-us`} />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">Contact Us</h1>
              <p className="text-lg text-muted-foreground">
                We'd love to hear from you. Get in touch with our team.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">Send us an email</p>
                  <a href="mailto:contact@pulseindia.com" className="text-primary hover:underline">
                    contact@pulseindia.com
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">Share your thoughts</p>
                  <a href="mailto:feedback@pulseindia.com" className="text-primary hover:underline">
                    feedback@pulseindia.com
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>News Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">Share breaking news</p>
                  <a href="mailto:tips@pulseindia.com" className="text-primary hover:underline">
                    tips@pulseindia.com
                  </a>
                </CardContent>
              </Card>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>About PulseIndia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  PulseIndia is your trusted source for the latest Indian news and current affairs. We are committed to delivering accurate, timely, and comprehensive news coverage across various categories.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our automated news aggregation system ensures you stay updated with breaking news and important developments from across India, updated every few minutes.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  For business inquiries, partnerships, or press-related questions, please reach out to us using the contact information above. We aim to respond to all inquiries within 24-48 hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ContactUs;
