/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  FileText,
  ShieldCheck,
  ArrowRight,
  Mail,
} from "lucide-react";
import Link from "next/link";
import LabLinkSolutions from "@/components/LabLinkSolutions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import RequestQuote from "@/components/RequestQuote";

const LabLinkLandingPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim();

    if (!email) {
      toast.error("Please enter a valid email.");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "newsletter"), {
        email,
        createdAt: new Date(),
      });

      toast.success("Success!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        transition: Bounce,
        theme: "dark",
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-[#031f35] ">
      {/* Navigation */}

      <section
        className="relative w-full h-screen bg-cover bg-center flex items-center text-white"
        style={{ backgroundImage: "url('/images/lab-sign-in.jpg')" }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative max-w-[1500px] px-6 mx-auto w-full flex flex-col lg:items-start items-center text-center lg:text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-3xl drop-shadow-lg">
            Test anywhere with, <br />
            <span className="text-primary ">Lab Link</span>
          </h1>
          <div className="flex space-x-4">
            <Button asChild size="lg" className="bg-primary hover:bg-blue-700">
              <Link href={"/sign-in"}>Book a Test</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link className="text-black" href={"/about"}>
                Learn more
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="#about" className=" py-16">
        <div className="max-w-[1500px] mx-auto px-6">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose Lab Link?
          </h2>
          {/* Top Section with Text & Button */}
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start mb-12">
            <p className="text-white text-lg lg:max-w-xl">
              We make healthcare management effortless and transparent.
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Commercial */}
            <div className="bg-[#032540] p-6 rounded-lg shadow-md text-left">
              <CalendarCheck size={40} className="text-[#ffa800] mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Easy Booking
              </h3>
              <p className="text-gray-300 mb-4">
                Schedule lab tests with just a few clicks, anytime, anywhere.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center text-[#ffa800] font-medium hover:underline"
              >
                LEARN MORE <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>

            {/* Residential */}
            <div className="bg-[#032540] p-6 rounded-lg shadow-md text-left">
              <FileText size={40} className="text-[#ffa800] mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Quick Results
              </h3>
              <p className="text-gray-300 mb-4">
                Access comprehensive test results securely online within hours.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center text-[#ffa800] font-medium hover:underline"
              >
                LEARN MORE <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>

            {/* Interiors */}
            <div className="bg-[#032540] p-6 rounded-lg shadow-md text-left">
              <ShieldCheck size={40} className="text-[#ffa800] mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Privacy First
              </h3>
              <p className="text-gray-300 mb-4">
                Your data is encrypted and protected with bank-level security.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center text-[#ffa800] font-medium hover:underline"
              >
                LEARN MORE <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-white py-6 rounded-lg inline-block text-lg font-medium text-center">
            Book lab tests from the comfort of your home.{" "}
            <span className="font-bold text-[#ffa800]">
              Schedule Your Test Today!
            </span>
          </div>
        </div>
      </section>

      <LabLinkSolutions />

      <RequestQuote />

      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container px-4 mx-auto">
          <Card className="mx-auto shadow-md hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 md:p-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-12">
                {/* Content Section */}
                <div className="lg:w-1/2 mb-8 lg:mb-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-blue-100 transform hover:scale-105 transition-transform duration-200">
                    <Mail className="w-8 h-8 text-blue-600" />
                  </div>

                  <h2 className="mb-4 text-2xl md:text-3xl text-primary lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text">
                    Join Our Health Insights Mailing List
                  </h2>

                  <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-xl">
                    Stay updated with the latest health trends, lab testing
                    news, and medical breakthroughs. Join thousands of
                    health-conscious individuals who rely on our expert health
                    updates.
                  </p>

                  <p className="mt-6 text-xs text-gray-500">
                    By subscribing, you agree to receive medical and
                    health-related emails from us. You can unsubscribe at any
                    time.
                  </p>
                </div>

                {/* Form Section */}
                <div className="lg:w-1/2">
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-white md:p-8 rounded-lg shadow-sm"
                  >
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium inline-block mb-1.5"
                        >
                          Email
                        </Label>
                        <Input
                          name="email"
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="w-full transition-all duration-200 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-blue-700 text-white"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Subscribe
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default LabLinkLandingPage;
