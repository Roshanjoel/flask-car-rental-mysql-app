"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/Navbar";
import { getUser } from "@/lib/auth";
import { Calendar, DollarSign, Car as CarIcon, CheckCircle } from "lucide-react";

interface Rental {
  id: number;
  customerId: number;
  carId: number;
  rentalDate: string;
  returnDate: string | null;
  expectedReturnDate: string;
  totalPrice: number;
  status: string;
}

interface Car {
  id: number;
  model: string;
  brand: string;
  year: number;
  imageUrl: string;
  category: string;
}

interface RentalWithCar extends Rental {
  car?: Car;
}

export default function MyRentalsPage() {
  const router = useRouter();
  const [rentals, setRentals] = useState<RentalWithCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [returning, setReturning] = useState<number | null>(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);
    fetchRentals(currentUser.id);
  }, []);

  const fetchRentals = async (customerId: number) => {
    try {
      const response = await fetch(`/api/rentals?customerId=${customerId}`);
      if (!response.ok) throw new Error("Failed to fetch rentals");
      
      const data = await response.json();
      
      // Fetch car details for each rental
      const rentalsWithCars = await Promise.all(
        data.map(async (rental: Rental) => {
          try {
            const carResponse = await fetch(`/api/cars?id=${rental.carId}`);
            const car = await carResponse.json();
            return { ...rental, car };
          } catch {
            return rental;
          }
        })
      );
      
      setRentals(rentalsWithCars);
    } catch (err) {
      setError("Failed to load rentals.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnCar = async (rentalId: number) => {
    setReturning(rentalId);
    setError("");

    try {
      const response = await fetch(`/api/rentals/return?id=${rentalId}`, {
        method: "PUT",
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || "Failed to return car");
        setReturning(null);
        return;
      }

      // Refresh rentals
      if (user) {
        await fetchRentals(user.id);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setReturning(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Rentals</h1>
          <p className="text-muted-foreground">View and manage your car rentals</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <div className="flex flex-col md:flex-row gap-4 p-6">
                  <Skeleton className="h-32 w-full md:w-48" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : rentals.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <CarIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No rentals yet</h3>
              <p className="text-muted-foreground mb-6">Start by browsing our available cars</p>
              <Button onClick={() => router.push("/available-cars")}>
                Browse Cars
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {rentals.map((rental) => (
              <Card key={rental.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  {rental.car && (
                    <div className="relative h-48 md:h-auto md:w-64 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={rental.car.imageUrl}
                        alt={`${rental.car.brand} ${rental.car.model}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        {rental.car && (
                          <>
                            <h3 className="text-2xl font-bold">
                              {rental.car.brand} {rental.car.model}
                            </h3>
                            <p className="text-muted-foreground">
                              {rental.car.year} • {rental.car.category}
                            </p>
                          </>
                        )}
                      </div>
                      <Badge
                        variant={
                          rental.status === "active"
                            ? "default"
                            : rental.status === "completed"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {rental.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Rental Date</div>
                          <div className="text-muted-foreground">
                            {formatDate(rental.rentalDate)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {rental.returnDate ? "Returned On" : "Expected Return"}
                          </div>
                          <div className="text-muted-foreground">
                            {rental.returnDate
                              ? formatDate(rental.returnDate)
                              : formatDate(rental.expectedReturnDate)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center text-2xl font-bold text-primary">
                        <DollarSign className="h-5 w-5" />
                        {rental.totalPrice.toFixed(2)}
                      </div>

                      {rental.status === "active" && (
                        <Button
                          onClick={() => handleReturnCar(rental.id)}
                          disabled={returning === rental.id}
                        >
                          {returning === rental.id ? (
                            <>Processing...</>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Return Car
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
