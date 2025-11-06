"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/Navbar";
import { getUser } from "@/lib/auth";
import { Loader2, Calendar, DollarSign, Car as CarIcon } from "lucide-react";

interface Car {
  id: number;
  model: string;
  brand: string;
  year: number;
  pricePerDay: number;
  imageUrl: string;
  category: string;
}

const rentSchema = z.object({
  rentalDate: z.string().min(1, "Rental date is required"),
  expectedReturnDate: z.string().min(1, "Return date is required"),
}).refine((data) => {
  const rental = new Date(data.rentalDate);
  const returnDate = new Date(data.expectedReturnDate);
  return returnDate > rental;
}, {
  message: "Return date must be after rental date",
  path: ["expectedReturnDate"],
});

type RentFormData = z.infer<typeof rentSchema>;

function RentCarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");
  
  const [car, setCar] = useState<Car | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [days, setDays] = useState(0);

  const form = useForm<RentFormData>({
    resolver: zodResolver(rentSchema),
    defaultValues: {
      rentalDate: "",
      expectedReturnDate: "",
    },
  });

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);

    if (!carId) {
      router.push("/available-cars");
      return;
    }

    fetchCar();
  }, [carId]);

  const fetchCar = async () => {
    try {
      const response = await fetch(`/api/cars?id=${carId}`);
      if (!response.ok) throw new Error("Failed to fetch car");
      
      const data = await response.json();
      setCar(data);
    } catch (err) {
      setError("Failed to load car details.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePrice = (rentalDate: string, returnDate: string) => {
    if (!rentalDate || !returnDate || !car) return;

    const rental = new Date(rentalDate);
    const returnD = new Date(returnDate);
    
    if (returnD > rental) {
      const diffTime = Math.abs(returnD.getTime() - rental.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDays(diffDays);
      setTotalPrice(diffDays * car.pricePerDay);
    }
  };

  const onSubmit = async (data: RentFormData) => {
    if (!user || !car) return;

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/rentals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: user.id,
          carId: car.id,
          rentalDate: data.rentalDate,
          expectedReturnDate: data.expectedReturnDate,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to create rental");
        setIsSubmitting(false);
        return;
      }

      setSuccess("Car rented successfully!");
      setTimeout(() => {
        router.push("/my-rentals");
      }, 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>Car not found</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Rent a Car</h1>
          <p className="text-muted-foreground">Complete the form to rent this vehicle</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Car Details */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={car.imageUrl}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{car.brand} {car.model}</h3>
                <p className="text-muted-foreground">{car.year} • {car.category}</p>
              </div>
              <div className="flex items-center text-3xl font-bold text-primary">
                <DollarSign className="h-6 w-6" />
                {car.pricePerDay}
                <span className="text-sm font-normal text-muted-foreground ml-2">/day</span>
              </div>
            </CardContent>
          </Card>

          {/* Rental Form */}
          <Card>
            <CardHeader>
              <CardTitle>Rental Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="bg-green-50 border-green-200">
                      <AlertDescription className="text-green-800">{success}</AlertDescription>
                    </Alert>
                  )}

                  <FormField
                    control={form.control}
                    name="rentalDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rental Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => {
                              field.onChange(e);
                              calculatePrice(e.target.value, form.getValues("expectedReturnDate"));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expectedReturnDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Return Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            min={form.watch("rentalDate") || new Date().toISOString().split("T")[0]}
                            onChange={(e) => {
                              field.onChange(e);
                              calculatePrice(form.getValues("rentalDate"), e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {totalPrice > 0 && (
                    <div className="p-4 bg-primary/5 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Rental Duration:</span>
                        <span className="font-semibold">{days} days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Price per day:</span>
                        <span className="font-semibold">${car.pricePerDay}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-lg font-bold">
                        <span>Total Price:</span>
                        <span className="text-primary">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm Rental
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function RentCarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    }>
      <RentCarContent />
    </Suspense>
  );
}
