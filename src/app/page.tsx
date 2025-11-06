"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Car, Shield, Clock, DollarSign, CheckCircle, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Premium Car Rental Service
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Experience luxury and convenience with our wide selection of premium vehicles. Book your perfect ride today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/available-cars">
              <Button size="lg" className="text-lg px-8 py-6">
                <Car className="mr-2 h-5 w-5" />
                Browse Cars
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50 backdrop-blur">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-muted-foreground text-lg">Experience the best car rental service with premium features</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Car className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Wide Selection</CardTitle>
              <CardDescription>
                Choose from sedans, SUVs, sports cars, and electric vehicles from top brands like BMW, Mercedes, and Tesla.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <DollarSign className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Competitive Pricing</CardTitle>
              <CardDescription>
                Enjoy affordable daily rates starting from $40/day with transparent pricing and no hidden fees.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="h-12 w-12 text-primary mb-4" />
              <CardTitle>24/7 Availability</CardTitle>
              <CardDescription>
                Book anytime, anywhere with our easy online system. Flexible rental periods to suit your schedule.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Safe & Secure</CardTitle>
              <CardDescription>
                All vehicles are regularly maintained and sanitized. Comprehensive insurance coverage included.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CheckCircle className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Easy Booking</CardTitle>
              <CardDescription>
                Simple 3-step process: Browse, Book, Drive. Real-time availability and instant confirmation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Customer Support</CardTitle>
              <CardDescription>
                Dedicated support team ready to assist you. Manage your bookings easily through your dashboard.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground text-lg">Everything you need for a seamless rental experience</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="text-2xl">For Customers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Easy Registration</h4>
                  <p className="text-sm text-muted-foreground">Quick sign-up process to get started</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Browse Available Cars</h4>
                  <p className="text-sm text-muted-foreground">Filter by category, price, and availability</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Book & Rent</h4>
                  <p className="text-sm text-muted-foreground">Select dates and confirm your rental</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Manage Rentals</h4>
                  <p className="text-sm text-muted-foreground">Track active rentals and return vehicles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle className="text-2xl">For Administrators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Car Management</h4>
                  <p className="text-sm text-muted-foreground">Add, edit, and delete car records</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Customer Overview</h4>
                  <p className="text-sm text-muted-foreground">View all registered customers</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Real-time Updates</h4>
                  <p className="text-sm text-muted-foreground">Track availability and bookings</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Full Control</h4>
                  <p className="text-sm text-muted-foreground">Comprehensive dashboard for fleet management</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 mb-16">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Hit the Road?</h2>
            <p className="text-xl mb-8 text-blue-50">Join thousands of satisfied customers and book your car today</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  Create Account
                </Button>
              </Link>
              <Link href="/available-cars">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent text-white border-white hover:bg-white/10">
                  View Cars
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Car Rental System. All rights reserved.</p>
            <p className="text-sm mt-2">Built with Next.js, TypeScript, and Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}