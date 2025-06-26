import { UserButton, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation';
import React from 'react'

const Appbar = () => {
  const { user } = useUser();
  const router = useRouter();
  return (
    <div>
      <nav className="bg-white shadow-md px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-50">
        <div className="text-xl md:text-2xl font-extrabold text-red-600 mb-2 md:mb-0">MightyGo</div>
        <div className="flex items-center space-x-2 md:space-x-6 text-sm md:text-base text-gray-700 font-medium">
          <a href="#" className="hover:text-red-600 transition" onClick={()=>{router.push(`/dashboard/${user?.id}`)}}>Services</a>
          <a href="#" className="hover:text-red-600 transition" onClick={()=>router.push(`/your-orders/${user?.id}`)}>Your Orders</a>
          <a href="#" className="hover:text-red-600 transition">Help</a>
          <div className="flex items-center space-x-4">
            <UserButton afterSignOutUrl="/" />
            <a href="/vendor-signup" className="bg-red-600 text-white px-2 md:px-3 py-1 md:py-2 rounded-md text-xs md:text-sm hover:bg-pink-700 transition">
              Become a Vendor
            </a>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Appbar