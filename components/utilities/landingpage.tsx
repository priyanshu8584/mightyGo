'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaLinkedin, FaLinkedinIn } from 'react-icons/fa'
import { Sparkles, Check, Shield, Star, Handshake } from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push(`/dashboard/${user.id}`);
    }
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex flex-col items-center justify-center text-gray-800 px-6 relative overflow-hidden">
      {/* Topbar */}
      <header className="w-full bg-white shadow-sm py-4 px-6 fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
            <div className="bg-red-600 p-2 rounded-lg">
              <Handshake className="text-white h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-red-600">MightyGo</span>
          </div>
          <div className="flex gap-4 items-center">
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-red-600 hover:bg-red-50 text-base"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Features
            </Button>
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-red-600 hover:bg-red-50 text-base"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              How It Works
            </Button>
            <SignInButton mode="modal">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-base">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center pt-32 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 mb-6 bg-red-50 px-4 py-2 rounded-full">
            <Sparkles className="text-red-600" size={20} />
            <span className="uppercase text-red-600 tracking-wide font-semibold text-sm">
              Revolutionizing Local Services
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="text-red-600">Connecting</span> You With <br className="hidden md:block" />
            Trusted <span className="text-red-600">Local Experts</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Whether you need a service or want to offer one, MightyGo makes it simple, fast, and reliable.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-20">
            <Button
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-red-200 transition-all"
              onClick={() => router.push("/")}
            >
              <SignInButton mode="modal">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-base">
                Find Services Now
              </Button>
            </SignInButton>
            </Button>
            <Button
              
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-red-200 transition-all"
              onClick={() => router.push(`/`)}
            >
             <SignInButton mode="modal">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-base">
               Become a Vendor
              </Button>
            </SignInButton>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
              <Check className="text-red-600" size={20} />
              <span className="text-gray-700">Verified Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="text-red-600" size={20} />
              <span className="text-gray-700">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="text-red-600" size={20} />
              <span className="text-gray-700">Customer Reviews</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full max-w-7xl mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">Why Choose MightyGo?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We&apos;re changing the way people connect with local services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-all border-red-100">
            <CardHeader>
              <div className="bg-red-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <CardTitle className="text-2xl">Instant Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get connected with the best local vendors in minutes, not days. Our smart algorithm finds the perfect match for your needs.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-red-100">
            <CardHeader>
              <div className="bg-red-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                  <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <CardTitle className="text-2xl">Quality Guaranteed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                All vendors are vetted and reviewed. We maintain high standards so you get quality service every time.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-red-100">
            <CardHeader>
              <div className="bg-red-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                </svg>
              </div>
              <CardTitle className="text-2xl">Transparent Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                No hidden fees or surprises. See upfront pricing and choose the option that fits your budget.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full bg-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">How MightyGo Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to get the service you need or start your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: "Sign Up", desc: "Create your account as a customer or vendor in minutes" },
              { title: "Post Your Need", desc: "Describe what service you need or offer" },
              { title: "Get Matched", desc: "Our system connects you with the perfect match" },
              { title: "Complete Job", desc: "Get the work done and leave a review" }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-7xl mx-auto py-20 px-4 text-center">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-12 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and vendors using MightyGo today
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
           <Button
              
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-red-200 transition-all"
              onClick={() => router.push(`/`)}
            >
             <SignInButton mode="modal">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-base">
               Join as a Customer
              </Button>
            </SignInButton>
            </Button>
           <Button
              
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-red-200 transition-all"
              onClick={() => router.push(`/`)}
            >
             <SignInButton mode="modal">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-base">
               Become a Vendor
              </Button>
            </SignInButton>
            </Button>
          </div>''
        </div>
      </section>

      <footer className="w-full bg-white py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="bg-red-600 p-2 rounded-lg">
              <Handshake className="text-white h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-red-600">MightyGo</span>
          </div>
          <div className="text-gray-500 text-center md:text-right font-bold">
            <Link
      href="https://www.linkedin.com/your-profile" 
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label="LinkedIn Profile"
    >
      <FaLinkedinIn className="w-5 h-5 text-blue-600" />
      Developed by Priyanshu Singh
    </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}