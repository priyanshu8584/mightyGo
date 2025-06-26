import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const VendorSideBar = () => {
   const { user } = useUser();
    const [activeSection, setActiveSection] = useState<'list' | 'add' | 'testimonials' | 'reviews'|'bookings'>('list');
    // const [name, setName] = useState('');
    // const [description, setDescription] = useState('');
    // const [price, setPrice] = useState('');
    // const [category, setCategory] = useState('');
    // const [photos, setPhoto] = useState<File | null>(null);
    // const [adding, setAdding] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router= useRouter();
  
    // const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    // const addService = useMutation(api.services.addService);
    // const services = useQuery(api.services.getServiceById, { vendorId: user?.id || '' }) || [];
  return (
    <div>
        <div className="md:hidden flex justify-between items-center p-4 bg-white shadow-sm">
              <h2 className="text-lg font-bold text-blue-800">Vendor Menu</h2>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
      
            {/* Sidebar - Hidden on mobile unless menu is open */}
            <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white shadow-md p-4 md:p-6 space-y-4`}>
              <h2 className="hidden md:block text-lg font-bold text-blue-800 mb-6 h-full">Vendor Menu</h2>
              <ul className="space-y-2 md:space-y-4 text-gray-700 font-medium">
                <li 
                  onClick={() => {
                    setActiveSection('list');
                    setMobileMenuOpen(false);
                  }} 
                  className={`cursor-pointer p-2 rounded ${activeSection === 'list' ? 'bg-blue-200 text-blue-800' : ''}`}
                >
                  Your Services
                </li>
                <li 
                  onClick={() => {
                    setActiveSection('add');
                    setMobileMenuOpen(false);
                  }} 
                  className={`cursor-pointer p-2 rounded ${activeSection === 'add' ? 'bg-blue-200 text-blue-800' : ''}`}
                >
                  Add Service
                </li>
                <li 
                  onClick={() => {
                    setActiveSection('testimonials');
                    setMobileMenuOpen(false);
                  }} 
                  className={`cursor-pointer p-2 rounded ${activeSection === 'testimonials' ? 'bg-blue-200 text-blue-800' : ''}`}
                >
                  Your Testimonials
                </li>
                <li 
                  onClick={() => {
                    setActiveSection('reviews');
                    setMobileMenuOpen(false);
                  }} 
                  className={`cursor-pointer p-2 rounded ${activeSection === 'reviews' ? 'bg-blue-200 text-blue-800' : ''}`}
                >
                  Your Reviews
                </li>
                <li onClick={() => {
                    setActiveSection('bookings');
                    setMobileMenuOpen(false);
                    router.push(`/vendor-orders/${user?.id}`);

                }}>
                  Your Bookings
                </li>
              </ul>
            </aside>
    </div>
  )
}

export default VendorSideBar