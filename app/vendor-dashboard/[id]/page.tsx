'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { Id } from '@/convex/_generated/dataModel';
import { Menu, Pencil, X, Plus, Calendar, Star, MessageSquare, Bookmark, User, Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

// Service categories
const SERVICE_CATEGORIES = [
  "Photography",
  "Catering",
  "Music",
  "Decoration",
  "Venue",
  "Makeup",
  "Transportation",
  "Entertainment",
  "Planning",
  "Other"
];

const VendorDashboard = () => {
  const { user } = useUser();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'list' | 'add' | 'testimonials' | 'reviews' | 'bookings'>('list');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    phoneNumber: '',
    duration: '',
    address: ''
  });
  const [photos, setPhoto] = useState<File | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const services = useQuery(api.services.getServiceById, { vendorId: user?.id || '' }) || [];
  const bookings = useQuery(api.bookings.getBookingsForVendor, { vendorId: user?.id || '' }) || [];
  const users = useQuery(api.users.getUsersByVendorId, { vendorId: user?.id || '' }) || [];

 
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const addService = useMutation(api.services.addService);
  const deleteService = useMutation(api.services.deleteService);

  const handleEdit = (id: Id<"services">) => {
    router.push(`/vendor/edit-service/${id}`);
  };

  const handleDelete = async (id: Id<"services">) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await deleteService({ id });
      toast.success("Service deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete service.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddService = async () => {
    if (!formData.name || !formData.description || !formData.price || !formData.category !|| !formData.phoneNumber || !formData.address) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsAdding(true);
      let storageIds: Id<"_storage">[] = [];

      if (photos) {
        const postUrl = await generateUploadUrl();
        const res = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": photos.type },
          body: photos,
        });
        const data = await res.json();
        storageIds = [data.storageId as Id<"_storage">];
      }

      await addService({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        phoneNumber: formData.phoneNumber,
        duration: parseFloat(formData.duration) || 0,
        address: formData.address,
        vendorId: user?.id || '',
        vendorName: user?.firstName || '',
        photos: storageIds,
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        duration: '',
        phoneNumber: '',
        address: ''
      });
      setPhoto(null);
      toast.success('Service added successfully!');
      setActiveSection('list');
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error('Failed to add service.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white shadow-sm border-b">
        <h2 className="text-lg font-bold text-blue-800 flex items-center gap-2">
          <User size={20} /> Vendor Dashboard
        </h2>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white shadow-md border-r`}>
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-blue-800 flex items-center gap-2">
            <User size={20} /> Vendor Menu
          </h2>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <Button
                variant={activeSection === 'list' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
                onClick={() => {
                  setActiveSection('list');
                  setMobileMenuOpen(false);
                }}
              >
                <Bookmark size={16} /> Your Services
              </Button>
            </li>
            <li>
              <Button
                variant={activeSection === 'add' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
                onClick={() => {
                  setActiveSection('add');
                  setMobileMenuOpen(false);
                }}
              >
                <Plus size={16} /> Add Service
              </Button>
            </li>
            <li>
              <Button
                variant={activeSection === 'bookings' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
                onClick={() => {
                  setActiveSection('bookings');
                  setMobileMenuOpen(false);
                }}
              >
                <Calendar size={16} /> Bookings
              </Button>
            </li>
            <li>
              <Button
                variant={activeSection === 'reviews' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
                onClick={() => {
                  setActiveSection('reviews');
                  setMobileMenuOpen(false);
                }}
              >
                <Star size={16} /> Reviews
              </Button>
            </li>
            <li>
              <Button
                variant={activeSection === 'testimonials' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
                onClick={() => {
                  setActiveSection('testimonials');
                  setMobileMenuOpen(false);
                }}
              >
                <MessageSquare size={16} /> Testimonials
              </Button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        {/* Add Service Section */}
        {activeSection === 'add' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus size={20} /> Add New Service
              </CardTitle>
              <CardDescription>Fill in the details of your new service offering</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="photo">Service Image</Label>
                <Input 
                  id="photo"
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)} 
                />
                {photos && (
                  <div className="relative mt-2">
                    <img
                      src={URL.createObjectURL(photos)}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md"
                      onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setPhoto(null)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Wedding Photography"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your service in detail"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 5000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Duration *</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g. 2 hours"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 9876543210"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your service address"
                  rows={2}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setActiveSection('list')}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddService}
                disabled={isAdding}
              >
                {isAdding ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* List Services Section */}
        {activeSection === 'list' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Bookmark size={20} /> Your Services
              </h2>
              <Button
                onClick={() => setActiveSection('add')}
                className="gap-2"
              >
                <Plus size={16} /> Add Service
              </Button>
            </div>

            {services.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <Bookmark size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No services listed yet</h3>
                  <p className="text-gray-500 mb-4">Add your first service to start receiving bookings</p>
                  <Button onClick={() => setActiveSection('add')}>
                    <Plus className="mr-2 h-4 w-4" /> Add Service
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <Card key={service._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="relative pb-2">
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(service._id)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDelete(service._id)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <Badge variant="outline" className="w-fit">
                        {service.category}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      {service.photos && service.photos.length > 0 && (
                        <ServiceImage storageId={service.photos[0]} />
                      )}
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                        {service.description}
                      </p>
                      <Separator className="my-3" />
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-blue-600">
                          ₹{service.price}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(service.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Section */}
        {activeSection === 'bookings' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar size={20} /> Your Bookings
            </h2>

            {bookings.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <Calendar size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                  <p className="text-gray-500">Your upcoming bookings will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const service = services.find((s) => s._id === booking.serviceId);
                  const userData = users.find((u) => u?.userId === booking.userId);

                  return (
                    <Card key={booking._id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {service ? service.name : 'Unknown Service'}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Booking ID: {booking._id}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                            className="flex items-center gap-1"
                          >
                            {booking.status === 'confirmed' ? (
                              <CheckCircle size={14} />
                            ) : (
                              <AlertCircle size={14} />
                            )}
                            {booking.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <User size={18} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{userData ? userData.name : 'Unknown User'}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail size={14} /> {userData ? userData.email : booking.userId}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-2 rounded-full">
                            <Clock size={18} className="text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">Booking Date</p>
                            <p className="text-sm text-gray-500">
                              {new Date(booking.selectedDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Reviews Section */}
        {activeSection === 'reviews' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star size={20} /> Customer Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="py-8 text-center">
              <div className="text-gray-400 mb-4">
                <Star size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
              <p className="text-gray-500">Customer reviews will appear here</p>
            </CardContent>
          </Card>
        )}

        {/* Testimonials Section */}
        {activeSection === 'testimonials' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare size={20} /> Testimonials
              </CardTitle>
            </CardHeader>
            <CardContent className="py-8 text-center">
              <div className="text-gray-400 mb-4">
                <MessageSquare size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No testimonials yet</h3>
              <p className="text-gray-500">Customer testimonials will appear here</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

function ServiceImage({ storageId }: { storageId: Id<"_storage"> }) {
  const imageUrl = useQuery(api.files.getUrl, { storageId });
  
  if (!imageUrl) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-md flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="w-full aspect-video relative bg-gray-100 rounded-md overflow-hidden">
      <Image
        src={imageUrl}
        alt="Service image"
        fill
        className="object-cover"
        onError={(e) => {
          console.error("Image failed to load");
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
}

export default VendorDashboard;