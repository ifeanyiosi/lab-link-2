"use client";

import React, { useState } from "react";
import { Mail, Phone, ChevronDown, ChevronUp } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

const SupportPage = () => {
  const [activeQuestions, setActiveQuestions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<null | "success" | "error">(
    null
  );

  const faqCategories = [
    {
      title: "Account & Profile",
      questions: [
        {
          question: "How do I reset my password?",
          answer:
            "You can reset your password by going to the login page and clicking 'Forgot Password'. Follow the instructions sent to your registered email.",
        },
        {
          question: "Can I change my profile picture?",
          answer:
            "Yes, you can change your profile picture in the Account Settings page under the Profile section.",
        },
      ],
    },
    {
      title: "Test Results",
      questions: [
        {
          question: "How can I view my test results?",
          answer:
            "Log in to your patient dashboard and navigate to the 'Test Results' section. You can download or share your results from there.",
        },
        {
          question: "Are my test results confidential?",
          answer:
            "Absolutely. We follow strict HIPAA guidelines to ensure your medical information remains private and secure.",
        },
      ],
    },
    {
      title: "Billing & Insurance",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept credit/debit cards, bank transfers, and most major insurance providers.",
        },
      ],
    },
  ];

  const toggleQuestion = (category: string, question: string) => {
    const key = `${category}-${question}`;
    setActiveQuestions((prev) =>
      prev.includes(key) ? prev.filter((q) => q !== key) : [...prev, key]
    );
  };

  const filteredFAQs = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus(null);

    try {
      await addDoc(collection(db, "support-question"), {
        name,
        email,
        message,
        submittedAt: serverTimestamp(),
      });

      setFormStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting support request:", error);
      setFormStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="text-center mb-12">
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We&apos;re here to help you with any questions or concerns. Browse our
          FAQs or contact our support team.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <Input
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Contact Options */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardContent className="pt-6 text-center">
            <Mail className="mx-auto mb-4 w-12 h-12 text-primary" />
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p>healthesphere@gmail.com</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Phone className="mx-auto mb-4 w-12 h-12 text-primary" />
            <h3 className="font-semibold mb-2">Phone Support</h3>
            <p>08058765439</p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Frequently Asked Questions
        </h2>
        {filteredFAQs.map((category, catIndex) => (
          <div key={catIndex} className="mb-6">
            <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
            {category.questions.map((faq, faqIndex) => {
              const key = `${category.title}-${faq.question}`;
              const isActive = activeQuestions.includes(key);

              return (
                <Card key={faqIndex} className="mb-4">
                  <CardContent>
                    <div
                      onClick={() =>
                        toggleQuestion(category.title, faq.question)
                      }
                      className="flex justify-between items-center cursor-pointer py-4"
                    >
                      <h4 className="font-medium">{faq.question}</h4>
                      {isActive ? <ChevronUp /> : <ChevronDown />}
                    </div>
                    {isActive && (
                      <>
                        <Separator className="mb-4" />
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="max-w-xl mx-auto mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Can&apos;t Find What You Need?</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label>Name</Label>
                <Input
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  placeholder="Your Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Message</Label>
                <textarea
                  className="w-full border rounded-md p-2 min-h-[120px]"
                  placeholder="Describe your issue..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Support Request"}
              </Button>

              {formStatus === "success" && (
                <p className="text-green-600 mt-2 text-center">
                  Your message has been submitted!
                </p>
              )}
              {formStatus === "error" && (
                <p className="text-red-600 mt-2 text-center">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportPage;
