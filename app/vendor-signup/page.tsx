'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const VendorSignupForm = () => {
  const { user } = useUser();
  const router = useRouter();

  const registerVendor = useMutation(api.vendors.newVendor);
  const allVendors = useQuery(api.vendors.getAllVendors);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !allVendors) return;

    const existingVendor = allVendors.find(v => v.vendorId === user.id);
    if (existingVendor) {
      toast.success('Welcome back, vendor!');
      router.push(`/vendor-dashboard/${user.id}`);
    }
  }, [user, allVendors, router]);

  const handleSignup = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await registerVendor({
        name: user.firstName || '',
        email: user.primaryEmailAddress?.emailAddress || '',
        vendorId: user.id,
      });
      toast.success('Vendor registration successful!');
      router.push(`/vendor-dashboard/${user.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Vendor signup failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-center mt-10 text-gray-600">Please sign in first.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Join as a Vendor</h2>
      <p className="text-sm text-center text-gray-500 mb-6">
        You’re signed in as <span className="font-medium text-gray-700">{user.firstName}</span>. Click below to register as a vendor.
      </p>

      <button
        onClick={handleSignup}
        disabled={loading}
        className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Registering...
          </>
        ) : (
          'Register as Vendor'
        )}
      </button>
    </div>
  );
};

export default VendorSignupForm;
