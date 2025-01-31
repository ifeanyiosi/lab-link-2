"use client";

import Link from "next/link";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            Welcome to Lab Link
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Your Gateway to Modern Healthcare Collaboration - Connecting
            Patients, Laboratories, and Healthcare Providers in Real-Time
          </p>

          {/* Action Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                href: "/sign-up",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                ),
                title: "Patient Sign Up",
                description:
                  "Get started with seamless health management and lab results tracking",
                bgGradient: "from-blue-500 to-indigo-600",
                iconBg: "bg-blue-100",
                iconColor: "text-blue-600",
              },
              {
                href: "/lab-sign-up",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                ),
                title: "Lab Sign Up",
                description:
                  "Connect with patients and manage test results efficiently",
                bgGradient: "from-purple-500 to-pink-600",
                iconBg: "bg-purple-100",
                iconColor: "text-purple-600",
              },
              {
                href: "/sign-in",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                ),
                title: "Sign In",
                description:
                  "Access your account to manage your health or lab services",
                bgGradient: "from-gray-600 to-gray-800",
                iconBg: "bg-gray-100",
                iconColor: "text-gray-600",
              },
            ].map((card, index) => (
              <Link
                key={index}
                href={card.href}
                className="group relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity`}
                />
                <div className={`mb-4 ${card.iconBg} p-4 rounded-full`}>
                  <svg
                    className={`w-12 h-12 ${card.iconColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {card.icon}
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {card.title}
                </h2>
                <p className="text-gray-600 text-center text-sm md:text-base">
                  {card.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-blue-600 text-2xl mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">
                Register Your Account
              </h3>
              <p className="text-gray-600">
                Quick signup process with secure verification
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-purple-600 text-2xl mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Manage Your Health</h3>
              <p className="text-gray-600">
                Access tests, results, and recommendations
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-green-600 text-2xl mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Get Results Faster</h3>
              <p className="text-gray-600">
                Real-time updates and digital reports
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-16 rounded-3xl shadow-sm mb-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6">
                <svg
                  className="w-8 h-8 text-blue-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <h3 className="text-xl font-semibold mb-3">Instant Results</h3>
                <p className="text-gray-600">
                  Receive digital reports within hours of test completion
                </p>
              </div>
              <div className="p-6">
                <svg
                  className="w-8 h-8 text-green-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold mb-3">HIPAA Compliant</h3>
                <p className="text-gray-600">
                  Bank-grade security for all health data
                </p>
              </div>
              <div className="p-6">
                <svg
                  className="w-8 h-8 text-purple-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold mb-3">
                  Multi-user Access
                </h3>
                <p className="text-gray-600">
                  Share results securely with healthcare providers
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <p className="text-gray-600 mb-4">
                &quot;Lab Link revolutionized how we manage patient test
                results. The platform is intuitive and has significantly reduced
                our administrative work.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold">Dr. Sarah Johnson</div>
                  <div className="text-sm text-gray-500">
                    Chief Medical Officer
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <p className="text-gray-600 mb-4">
                &quot;As a patient, I love getting my results instantly. The
                interface is user-friendly and the support team is always
                responsive.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold">Michael Chen</div>
                  <div className="text-sm text-gray-500">Lab Link User</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Homepage;
