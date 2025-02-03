import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Stethoscope,
  CalendarCheck,
  FileText,
  ShieldCheck,
} from "lucide-react";

const LabLinkLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation */}

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-extrabold text-blue-900 mb-6 leading-tight">
            Your Health, <br />
            Simplified
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Schedule lab tests, access results, and manage your health journey
            seamlessly.
          </p>
          <div className="flex space-x-4">
            <Button size="lg" className="bg-primary hover:bg-blue-700">
              Book a Test
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <img
            src="/images/lab-link-hero.jpg"
            alt="Medical Test"
            className="rounded-xl shadow-2xl"
          />
        </div>
      </main>

      {/* Features Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            Why Choose Lab Link
          </h2>
          <p className="text-xl text-gray-600">
            We make healthcare management effortless and transparent.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <CalendarCheck className="text-blue-600" size={48} />,
              title: "Easy Booking",
              description:
                "Schedule lab tests with just a few clicks, anytime, anywhere.",
            },
            {
              icon: <FileText className="text-blue-600" size={48} />,
              title: "Quick Results",
              description:
                "Access comprehensive test results securely online within hours.",
            },
            {
              icon: <ShieldCheck className="text-blue-600" size={48} />,
              title: "Privacy First",
              description:
                "Your data is encrypted and protected with bank-level security.",
            },
          ].map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-all">
              <CardHeader className="flex flex-col items-center text-center">
                {feature.icon}
                <CardTitle className="mt-4 text-xl text-blue-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-600">
                {feature.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LabLinkLandingPage;
