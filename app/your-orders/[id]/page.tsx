'use client';

import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { Calendar, Clock, PackageCheck, PackageX, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Appbar from '@/components/Appbar';

const YourOrders = () => {
  const { user } = useUser();

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50 px-4 gap-4">
        <PackageX className="w-12 h-12 text-red-600" />
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign in to view orders
        </h2>
        <p className="text-center text-gray-600 max-w-md">
          Please sign in to access your booking history and manage your orders.
        </p>
      </div>
    );

  const bookings = useQuery(api.bookings.getBookingsByUser, {
    userId: user?.id,
  });

  if (bookings === undefined)
    return (
      <div className="min-h-screen bg-red-50 p-8">
        <Appbar />
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-red-700 mb-8">
            Your Orders
          </h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );

  if (bookings.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50 px-4 gap-6">
        <PackageCheck className="w-12 h-12 text-red-600" />
        <h2 className="text-2xl font-bold text-center text-gray-800">
          No orders yet
        </h2>
        <p className="text-center text-gray-600 max-w-md">
          You haven't booked any services yet. Explore our services to get started!
        </p>
        <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all">
          Browse Services
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-red-50 p-4 sm:p-8">
      <Appbar />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-red-700 mb-2">
            Your Orders
          </h2>
          <p className="text-gray-600">
            {bookings.length} {bookings.length === 1 ? 'order' : 'orders'} found
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <Card key={booking._id} className="hover:shadow-lg transition-shadow border-red-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-red-600" />
                  Order #{booking._id.slice(0, 6)}
                </CardTitle>
                <CardDescription className="text-sm">
                  Booked on {new Date(booking._creationTime).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-red-600" />
                  <span>Vendor: {booking.vendorId.slice(0, 6)}...</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-red-600" />
                  <span>Date: {booking.selectedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-red-600" />
                  <span>Status: 
                    <span className={`ml-1 font-medium ${
                      booking.status === 'confirmed' 
                        ? 'text-green-600' 
                        : booking.status === 'pending' 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                    }`}>
                      {booking.status}
                    </span>
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  size="sm" 
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YourOrders;