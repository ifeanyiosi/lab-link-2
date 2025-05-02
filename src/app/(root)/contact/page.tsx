/* eslint-disable react/no-unescaped-entities */

"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

interface ContactInfo {
  icon: string;
  title: string;
  details: string[];
}

interface FormField {
  id: string;
  type: string;
  placeholder: string;
  required: boolean;
  cols?: number;
  rows?: number;
}

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formSuccess, setFormSuccess] = useState<boolean | null>(null);

  const contactInfo: ContactInfo[] = [
    {
      icon: "phone",
      title: "Call Us",
      details: ["08058765439"],
    },
    {
      icon: "mail",
      title: "Email",
      details: ["healthesphere@gmail.com"],
    },
  ];

  const formFields: FormField[] = [
    { id: "name", type: "text", placeholder: "Full Name", required: true },
    {
      id: "email",
      type: "email",
      placeholder: "Email Address",
      required: true,
    },
    { id: "subject", type: "text", placeholder: "Subject", required: true },
    {
      id: "message",
      type: "textarea",
      placeholder: "Your Message or Inquiry",
      required: true,
      rows: 5,
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const docRef = await addDoc(collection(db, "lab-contact"), {
        ...formData,
        timestamp: serverTimestamp(),
      });

      console.log("Document written with ID:", docRef.id);
      setSuccess(true);

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Error adding document:", err);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const icons = {
    location: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    phone: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
    mail: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  };

  return (
    <div className="bg-gradient-to-b from-[#031f35] to-[#020f1a] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/contact.jpg"
            alt="Contact Our Lab"
            layout="fill"
            objectFit="cover"
            priority
            className="filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#031f35]/50 to-[#031f35]/90"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-6xl font-bold mb-6">
            Contact <span className="text-[#ffa800]">Us</span>
          </h1>
          <p className="text-2xl mb-10 text-gray-200">
            Book a test, make an inquiry, or speak with a specialist. We're here
            to help you stay healthy.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="#contact-form"
              className="px-8 py-4 bg-[#ffa800] text-[#031f35] font-bold rounded-md hover:bg-white transition-colors duration-300"
            >
              Book Now
            </Link>
            <Link
              href="/services"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-md hover:bg-white/10 transition-colors duration-300"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-20 h-1 bg-[#ffa800] mb-6"></div>
          <h2 className="text-5xl font-bold mb-4">Get In Touch</h2>
          <p className="text-xl text-gray-300 max-w-2xl">
            Reach out to us with your lab test needs, health questions, or
            appointment bookings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-[#052a42] to-[#041f32] p-2 rounded-xl text-center shadow-xl border border-[#052f4d] hover:translate-y-[-8px] transition-all duration-300"
            >
              <div className="flex justify-center items-center mb-4">
                <div className="bg-[#ffa800]/10 p-4 rounded-full text-[#ffa800]">
                  {icons[info.icon as keyof typeof icons]}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#ffa800] mb-4">
                {info.title}
              </h3>
              {info.details.map((detail, idx) => (
                <p key={idx} className="text-lg text-gray-300 mb-2">
                  {detail}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-24 px-3 max-w-4xl mx-auto">
        <div className="bg-gradient-to-b from-[#052a42] to-[#041f32] p-2 md:p-12 rounded-xl shadow-2xl border border-[#052f4d]">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-1 bg-[#ffa800] mb-6"></div>
            <h2 className="text-4xl font-bold mb-4">Send Us a Message</h2>
            <p className="text-gray-300">
              Have a question or want to book a test? Fill the form and we’ll
              get back shortly.
            </p>
          </div>

          {success && (
            <p className="text-green-600 mb-4">
              Message sent successfully! We'll contact you shortly.
            </p>
          )}
          {error && <p className="text-red-600 mb-4">{error}</p>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formFields.slice(0, 2).map((field) => (
                <div key={field.id} className="relative">
                  <input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formData[field.id as keyof typeof formData]}
                    onChange={handleChange}
                    className="w-full p-4 pl-5 bg-[#031f35] text-white rounded-lg outline-none border border-[#0a3b5c] focus:border-[#ffa800] transition-all duration-300 focus:shadow-lg"
                  />
                  <div className="absolute w-1 h-full bg-[#ffa800] rounded-l-lg left-0 top-0"></div>
                </div>
              ))}
            </div>

            <div className="relative">
              <input
                id="subject"
                type="text"
                placeholder="Subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-4 pl-5 bg-[#031f35] text-white rounded-lg outline-none border border-[#0a3b5c] focus:border-[#ffa800] transition-all duration-300 focus:shadow-lg"
              />
              <div className="absolute w-1 h-full bg-[#ffa800] rounded-l-lg left-0 top-0"></div>
            </div>

            <div className="relative">
              <textarea
                id="message"
                rows={5}
                placeholder="Your Message or Inquiry"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full p-4 pl-5 bg-[#031f35] text-white rounded-lg outline-none border border-[#0a3b5c] focus:border-[#ffa800] transition-all duration-300 focus:shadow-lg"
              />
              <div className="absolute w-1 h-full bg-[#ffa800] rounded-l-lg left-0 top-0"></div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#ffa800] text-[#031f35] font-bold py-4 rounded-lg hover:bg-white transition-colors duration-300 flex items-center justify-center ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#031f35]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
