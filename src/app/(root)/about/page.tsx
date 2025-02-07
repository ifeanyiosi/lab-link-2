import React from "react";
import { Award, Activity, Shield, HeartPulse } from "lucide-react";
import Link from "next/link";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">
              About Lab Links
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simplifying healthcare by providing seamless, secure, and swift
              access to your laboratory test results.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white shadow-lg rounded-xl p-8 transform transition hover:scale-105">
              <Award className="text-blue-600 w-12 h-12 mb-4" />
              <h2 className="text-2xl font-bold text-blue-900 mb-3">
                Precision & Reliability
              </h2>
              <p className="text-gray-600">
                We partner with certified laboratories to ensure accurate and
                dependable test results with the highest standards of medical
                diagnostics.
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-8 transform transition hover:scale-105">
              <Shield className="text-green-600 w-12 h-12 mb-4" />
              <h2 className="text-2xl font-bold text-blue-900 mb-3">
                Data Privacy
              </h2>
              <p className="text-gray-600">
                Your medical information is sacred. We employ state-of-the-art
                encryption and comply with HIPAA regulations to protect your
                data.
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-8 transform transition hover:scale-105">
              <Activity className="text-purple-600 w-12 h-12 mb-4" />
              <h2 className="text-2xl font-bold text-blue-900 mb-3">
                Quick Access
              </h2>
              <p className="text-gray-600">
                Instant digital access to your test results. No more waiting for
                mail or phone calls. View, download, and share with your
                healthcare provider.
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-8 transform transition hover:scale-105">
              <HeartPulse className="text-red-600 w-12 h-12 mb-4" />
              <h2 className="text-2xl font-bold text-blue-900 mb-3">
                Proactive Health
              </h2>
              <p className="text-gray-600">
                Track your health journey with comprehensive result histories,
                trend analysis, and personalized health insights.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
              Lab Links is more than a platform—it&apos;s your digital health
              companion, designed to make medical testing transparent,
              convenient, and patient-centric.
            </p>
            <Link
              href="/signup"
              className="bg-primary text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
