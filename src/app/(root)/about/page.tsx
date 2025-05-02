import React from "react";
import Image from "next/image";
import Link from "next/link";
import RequestQuote from "@/components/RequestQuote";

// Define TypeScript interfaces
interface StatCard {
  value: string;
  label: string;
  boldText: string;
}

interface Sector {
  tagline: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

// Data for the page
const sectors: Sector[] = [
  {
    tagline: "YOUR HEALTH, OUR PRIORITY",
    title: "Blood Test",
    description:
      "Routine blood tests to check for various health conditions including cholesterol, diabetes, and liver function.",
    image: "/images/blood-t.jpg",
    link: "/services/blood-test",
  },
  {
    tagline: "YOUR HEALTH, OUR PRIORITY",
    title: "X-Ray",
    description:
      "Diagnostic imaging for detecting bone fractures, infections, and tumors.",
    image: "/images/x-ray.jpg",
    link: "/services/x-ray",
  },
  {
    tagline: "YOUR HEALTH, OUR PRIORITY",
    title: "CT Scan",
    description:
      "High-resolution imaging for detecting internal injuries, diseases, and cancers.",
    image: "/images/ct.jpg",
    link: "/services/ct-scan",
  },
  {
    tagline: "YOUR HEALTH, OUR PRIORITY",
    title: "Urine Test",
    description:
      "Testing urine samples for signs of infections, kidney problems, and diabetes.",
    image: "/images/urine.jpg",
    link: "/services/urine-test",
  },
  {
    tagline: "YOUR HEALTH, OUR PRIORITY",
    title: "Ultrasound",
    description:
      "Non-invasive imaging to observe organs, blood flow, and conditions like pregnancy.",
    image: "/images/ultrasound.jpg",
    link: "/services/ultrasound",
  },
  {
    tagline: "YOUR HEALTH, OUR PRIORITY",
    title: "COVID-19 Test",
    description:
      "Rapid tests for detecting the presence of COVID-19 in the body.",
    image: "/images/covid.jpg",
    link: "/services/covid-19-test",
  },
];

// Component for stat cards
const StatCard: React.FC<StatCard> = ({ value, label, boldText }) => (
  <div className="bg-opacity-10 backdrop-filter backdrop-blur-lg bg-white/5 text-white p-8 rounded-xl text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/10">
    <p className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-[#fff] mb-2">
      {value}
    </p>
    <p className="text-lg">
      {label} <strong className="font-semibold">{boldText}</strong>
    </p>
  </div>
);

// Component for sector cards
const SectorCard: React.FC<Sector> = ({
  tagline,
  title,
  description,
  image,
}) => (
  <div className="bg-gradient-to-b from-[#052a42] to-[#031f35] shadow-xl rounded-xl overflow-hidden transition-all duration-500 hover:transform hover:scale-102 group border border-[#052f4d]">
    <div className="h-56 bg-gray-200 relative overflow-hidden">
      <Image
        src={image}
        alt={title}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#031f35] to-transparent opacity-40"></div>
    </div>
    <div className="p-8 relative">
      <div className="w-12 h-1 bg-primary mb-4"></div>
      <p className="text-sm text-primary font-semibold mb-2">{tagline}</p>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="mb-6 text-gray-300">{description}</p>
    </div>
  </div>
);

// Feature list item component
const FeatureItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-start group">
    <span className="text-primary font-bold mr-3 text-2xl leading-none group-hover:scale-125 transition-transform duration-300">
      –
    </span>
    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
      {text}
    </p>
  </div>
);

const AboutUs: React.FC = () => {
  const features: string[] = [
    "State-of-the-art laboratory testing services.",
    "Comprehensive diagnostic tools and equipment.",
    "Quick and accurate results for all lab tests.",
    "Patient-focused care with privacy and reliability.",
    "Expert medical professionals and technicians.",
    "A new service launched in 2025 to revolutionize healthcare diagnostics.",
  ];

  return (
    <div className="bg-gradient-to-b from-[#031f35] to-[#020f1a] text-white pt-20 ">
      {/* Hero Section */}
      <section className="relative h-screen lg:h-[80vh] w-full">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about-page.jpg"
            alt="Healthcare Facilities"
            layout="fill"
            objectFit="cover"
            priority
            className="filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#031f35]/90 to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center text-white">
          <h1 className="text-4xl font-bold mb-6 max-w-2xl leading-tight">
            Introducing <span className="text-primary ">Lab Testing</span>{" "}
            Services,
            <br />
            Delivering <span className="text-primary ">Accurate Results</span>
          </h1>
          <p className="text-2xl mb-8 max-w-2xl text-gray-200">
            Our lab testing service, launched in 2025, offers quick, accurate,
            and reliable results for all your healthcare needs.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-md text-center hover:bg-white/10 transition-colors duration-300"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-white">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="w-20 h-1 bg-primary mb-6"></div>
            <h2 className="text-5xl font-bold mb-4">About Us</h2>
            <p className="text-xl text-gray-300 max-w-3xl">
              Excellence in healthcare diagnostics with a focus on patient care
              and accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-lg mb-6 leading-relaxed text-gray-200">
                We are committed to delivering the highest quality diagnostic
                services. Our lab facilities, equipped with the latest
                technology, provide a full range of tests, from routine
                screenings to specialized diagnostics.
              </p>
              <p className="text-lg mb-8 leading-relaxed text-gray-200">
                Launched in 2025, we aim to set a new standard in laboratory
                testing, offering fast and accurate results with a
                patient-centered approach.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {features.map((feature, index) => (
                  <FeatureItem key={index} text={feature} />
                ))}
              </div>
            </div>
            <div className="space-y-12">
              <div className="bg-[#052a42] p-8 rounded-xl border-l-4 border-[#ffa800] shadow-lg transform transition-all duration-300 hover:translate-y-[-8px]">
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-gray-300">
                  To be the leading provider of accurate and accessible lab
                  testing services, enhancing the health and well-being of our
                  community.
                </p>
              </div>
              <div className="bg-[#052a42] p-8 rounded-xl border-l-4 border-[#ffa800] shadow-lg transform transition-all duration-300 hover:translate-y-[-8px]">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-300">
                  To provide reliable, fast, and affordable lab testing
                  services, empowering individuals with the knowledge to make
                  informed health decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors Overview */}
      <section className="py-24 bg-[#020d14]">
        <div className="container mx-auto px-6 text-white">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="w-20 h-1 bg-[#ffa800] mb-6"></div>
            <h2 className="text-5xl font-bold mb-4">Our Laboratory Services</h2>
            <p className="text-xl text-gray-300 max-w-3xl">
              Offering a wide range of lab tests to support healthcare providers
              and individuals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sectors.map((sector, index) => (
              <SectorCard key={index} {...sector} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <RequestQuote />

      {/* Footer Section */}
    </div>
  );
};

export default AboutUs;
