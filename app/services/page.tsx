'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Search, Filter, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Appbar from '@/components/Appbar';

export default function ServicesPage() {
  const router = useRouter();
  const services = useQuery(api.services.getAllServices, {});
  const categories = [...new Set(services?.map(service => service.category))];

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50">
      <Appbar />
      
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">All Services</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our complete catalog of {services?.length} professional services
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search services..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
              <option>All Categories</option>
              {categories?.map(category => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services?.map(service => (
            <Card 
              key={service._id} 
              className="hover:shadow-lg transition-all cursor-pointer border-red-100"
              onClick={() => router.push(`/service/${service._id}`)}
            >
              {/* Service Image */}
              <div className="h-48 bg-red-100 rounded-t-lg flex items-center justify-center text-red-400">
                {service.photos?.length ? (
                  <h1>hello</h1>
                  // <ServiceImage storageId={service.photos[0]} />
                ) : (
                  <span>No Image</span>
                )}
              </div>
              
              <CardContent className="p-4">
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-lg font-bold">{service.name}</CardTitle>
                </CardHeader>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    {service.category}
                  </span>
                  <p className="font-bold text-red-600">₹{service.price}</p>
                </div>
                <div className="flex items-center mt-2">
                  <Star className="text-yellow-500 fill-yellow-500 w-4 h-4 mr-1" />
                  <span className="text-sm text-gray-600">4.8 (24)</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 gap-2">
          <Button variant="outline" className="border-red-300">Previous</Button>
          <Button variant="outline" className="border-red-300 bg-red-100 text-red-600">1</Button>
          <Button variant="outline" className="border-red-300">2</Button>
          <Button variant="outline" className="border-red-300">Next</Button>
        </div>
      </div>
    </main>
  );
}