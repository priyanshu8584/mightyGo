'use client';

import {  useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Search, Loader2, Star, Users, ShieldCheck } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';
import { useRouter } from 'next/navigation';
import Appbar from '@/components/Appbar';

const Dashboard = () => {
  const SERVICE_CATEGORIES = [
  "Photography",
  "Catering",
  "Rentals",
  "Decoration",
  "Venue",
  "Makeup",
  "Transportation",
  "Entertainment",
  "Planning",
  "Other"
];

  const { user } = useUser();
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const itemsPerPage = 8;
  const router = useRouter();
  const username = user?.firstName;
  const services = useQuery(api.services.getAllServices, {});
  const vendors = useQuery(api.vendors.getAllVendors, {});

   const filteredServices = services?.filter(service =>
  (selectedCategory === '' || service.category === selectedCategory) &&
  (
    service.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    service.description.toLowerCase().includes(searchValue.toLowerCase()) ||
    service.category.toLowerCase().includes(searchValue.toLowerCase()) ||
    service.vendorName?.toLowerCase().includes(searchValue.toLowerCase())
  )
) || [];

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (!user) return <p className="text-center mt-10 text-lg text-gray-600">Please sign in to view services.</p>;
  if (services === undefined || vendors === undefined) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin text-red-600" size={32} />
    </div>
  );

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-red-50 to-gray-50">
      <Appbar />

      <div className="px-4 py-6 md:px-10 md:py-8 w-full">
        <div className="bg-red-600 rounded-2xl p-6 md:p-8 mb-8 text-white shadow-lg">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Welcome back, {username}! 👋</h1>
          <p className="text-red-100 md:text-lg">Discover amazing services in your area</p>

         {/* Search Bar & Category Filter */}
          <div className="relative w-full max-w-2xl mx-auto">
    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-300" size={20} />
    <input
      type="text"
      value={searchValue}
      onChange={(e) => {
        setSearchValue(e.target.value);
        setCurrentPage(1);
      }}
      placeholder="Search for services, categories, or vendors..."
      className="w-full pl-12 pr-4 py-3 md:py-4 border-0 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600 text-gray-800 placeholder-red-300 text-sm md:text-base bg-white/90"
    />
  </div>
<div className="flex flex-col gap-4 mt-6 max-w-7xl mx-auto">
  {/* Category Chips Only */}
  <div className="flex flex-wrap items-center justify-center gap-2 overflow-x-auto scrollbar-hide px-1">
    <button
      onClick={() => {
        setCurrentPage(1);
        setSelectedCategory('');
      }}
      className={`text-sm px-4 py-2 rounded-full border ${
        selectedCategory === ''
          ? 'bg-red-600 text-white'
          : 'bg-white text-red-600 border-red-300 hover:bg-red-50'
      }`}
    >
      All
    </button>
    {SERVICE_CATEGORIES.map((cat) => (
      <button
        key={cat}
        onClick={() => {
          setCurrentPage(1);
          setSelectedCategory(cat);
        }}
        className={`text-sm px-4 py-2 rounded-full border ${
          selectedCategory === cat
            ? 'bg-red-600 text-white'
            : 'bg-white text-red-600 border-red-300 hover:bg-red-50'
        }`}
      >
        {cat}
      </button>
    ))}
  </div>
</div>


        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { value: `${services.length}+`, label: "Services Available", icon: <Star className="text-red-600" /> },
            { value: `${vendors.length}+`, label: "Verified Vendors", icon: <Users className="text-red-600" /> },
            { value: "4.8", label: "Avg. Rating", icon: <Star className="text-red-600" /> },
            { value: "100%", label: "Secure Payments", icon: <ShieldCheck className="text-red-600" /> }
          ].map((stat, index) => (
            <Card key={index} className="bg-white border-red-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xl font-bold text-red-700">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {searchValue ? "Search Results" : "Featured Services"}
            </h2>
            <Button 
              variant="outline" 
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => router.push('/services')}
            >
              View All Services
            </Button>
          </div>

          {paginatedServices.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Search className="text-red-600" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No services found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your search or browse our full catalog
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {paginatedServices.map(service => (
                  <Card
                    key={service._id}
                    className="rounded-xl border-red-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => router.push(`/service/${service._id}`)}
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      {service.photos && service.photos.length > 0 ? (
                        <ServiceImage storageId={service.photos[0]} />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                          <span className="text-red-400 text-sm">No image available</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <CardHeader className="p-0 mb-2">
                        <CardTitle className="text-lg font-bold text-gray-800 line-clamp-1">
                          {service.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500 line-clamp-2">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                          {service.category}
                        </span>
                        <p className="text-lg font-bold text-red-600">
                          ₹{service.price}
                        </p>
                      </div>
                      <div className="flex items-center mt-3 pt-3 border-t border-red-50">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold text-red-600 mr-2">
                          {service.vendorName?.charAt(0)}
                        </div>
                        <p className="text-xs text-gray-500">
                          {service.vendorName}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-center items-center gap-2 mt-10">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
};

function ServiceImage({ storageId }: { storageId: Id<"_storage"> }) {
  const imageUrl = useQuery(api.files.getUrl, { storageId });

  return imageUrl ? (
    <img
      src={imageUrl}
      alt="Service image"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  ) : (
    <div className="h-full w-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
      <Loader2 className="animate-spin text-red-600" size={24} />
    </div>
  );
}

export default Dashboard;
