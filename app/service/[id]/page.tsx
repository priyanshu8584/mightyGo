'use client'
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Id } from '@/convex/_generated/dataModel';
import { Loader2 } from 'lucide-react';
import {  useUser } from '@clerk/nextjs';
import CommentsSection from '@/components/CommentSection';
import toast from 'react-hot-toast';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import Script from 'next/script';
import Appbar from '@/components/Appbar';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Service = () => {
  const serviceId = useParams().id as string;
  const { user } = useUser();
  const today = new Date();
  const serviceDisplay = useQuery(api.services.getServiceByIdOnly, { serviceId });
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const bookService = useMutation(api.bookings.bookService);

  const ServiceImage = ({ storageId }: { storageId: Id<"_storage"> }) => {
    const imageUrl = useQuery(api.files.getUrl, { storageId });

    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Service image"
            className="w-full h-full object-contain"
            onError={(e) => {
              console.error("Image failed to load");
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.innerHTML =
                '<div class="text-gray-500 text-sm">Image not available</div>';
            }}
          />
        ) : (
          <Loader2 className="animate-spin text-red-600" size={24} />
        )}
      </div>
    );
  };

  const handleBookNow = async () => {
    if (!selectedDate) {
      toast.error("Please select a date.");
      return;
    }
    if (!serviceDisplay) {
      toast.error("Service not found.");
      return;
    }
    if (!user) {
      toast.error("Please sign in to book a service.");
      return;
    }

    if (typeof window === 'undefined' || typeof window.Razorpay === 'undefined') {
      toast.error("Razorpay SDK not loaded. Try refreshing.");
      return;
    }

    const options = {
      key: 'rzp_test_4Sxhu2G0RVLthm',
      amount: serviceDisplay.price * 100,
      currency: "INR",
      name: "ServiceHub Booking",
      description: `Booking for ${serviceDisplay.name}`,
      handler: async function (response: any) {
        await bookService({
          serviceId: serviceDisplay._id,
          userId: user.id,
          vendorId: serviceDisplay.vendorId,
          selectedDate: selectedDate,
          paymentId: response.razorpay_payment_id,
          status: 'confirmed',
        });
        toast.success('Booking successful!');
      },
      prefill: {
        email: user?.emailAddresses[0].emailAddress,
      },
      theme: { color: "#ec4899" } // pinkish-red theme
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />

      {/* Navbar */}
      <Appbar/>

      <div className="w-full h-full px-4 md:px-10 lg:px-20 py-6">
        {serviceDisplay ? (
          <>
            <div className="flex flex-col lg:flex-row h-full justify-center items-start space-y-10 lg:space-y-0 lg:space-x-10">
              {/* Image Carousel */}
              <div className="w-full lg:w-1/2">
                <div className="h-96 lg:h-auto bg-black rounded-lg overflow-hidden shadow-md">
                  {serviceDisplay.photos && serviceDisplay.photos.length > 0 ? (
                    <Carousel
                      showArrows
                      showStatus={false}
                      showThumbs={false}
                      infiniteLoop
                      autoPlay={false}
                      stopOnHover
                      swipeable
                      dynamicHeight={false}
                      emulateTouch
                      className="h-full"
                    >
                      {serviceDisplay.photos.map((photoId, index) => (
                        <div key={index} className="h-full w-full flex items-center justify-center">
                          <ServiceImage storageId={photoId} />
                        </div>
                      ))}
                    </Carousel>
                  ) : (
                    <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Details */}
              <div className="w-full lg:w-1/2 space-y-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{serviceDisplay.name}</h1>
                <span className="text-2xl font-semibold text-red-600">₹{serviceDisplay.price}</span>
                <span className="inline-block bg-pink-100 text-red-800 text-sm px-3 py-1 rounded-full uppercase font-semibold tracking-wide">
                  {serviceDisplay.category}
                </span>

                <div className="prose max-w-none text-gray-700 text-lg leading-relaxed">
                  {serviceDisplay.description}
                </div>

                <div className="space-y-2">
                  <p className="text-gray-700">Duration: {serviceDisplay.duration}</p>
                  <p className="text-gray-700">Location:{serviceDisplay.address}</p>
                  <p className="text-gray-700">Phone Number{" "}:{serviceDisplay.phoneNumber}</p>
                </div>

                <div className="flex items-center space-x-4 border-t border-gray-200 pt-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{serviceDisplay.vendorName}</h4>
                    <p className="text-gray-600">Professional Service Provider</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Select Booking Date</h3>
                  <DayPicker
                    mode="single"
                    selected={selectedDate ? new Date(selectedDate) : undefined}
                    onSelect={(date) => date && setSelectedDate(date.toISOString().split('T')[0])}
                    fromDate={today}
                    modifiersClassNames={{
                      selected: 'bg-pink-600 text-white',
                      today: 'border-pink-600 border-2',
                    }}
                    className="mx-auto"
                  />
                  {selectedDate && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected Date: <span className="font-medium text-red-600">{selectedDate}</span>
                    </p>
                  )}
                </div>

                <button onClick={handleBookNow} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">
                  Book Now
                </button>
              </div>
            </div>

            {/* Comments Section Full Width on Large Devices */}
            <div className="hidden lg:block w-full mt-10">
              <CommentsSection serviceId={serviceDisplay._id} />
            </div>

            {/* Comments Section on Mobile */}
            <div className="block lg:hidden mt-10 px-4">
              <CommentsSection serviceId={serviceDisplay._id} />
            </div>
          </>
        ) : (
          <div className="h-screen w-full flex items-center justify-center">
            <div className="text-center max-w-md px-4">
              <h3 className="mt-4 text-xl font-medium text-gray-900">Service not found</h3>
              <p className="mt-2 text-gray-500">The service you're looking for doesn't exist or may have been removed.</p>
              <button className="mt-6 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md">
                Browse Services
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Service;
