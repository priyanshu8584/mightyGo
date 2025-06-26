import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const bookService = mutation({
  args: {
    serviceId: v.id("services"),   // reference to the service
    userId: v.string(),            // user ID from Clerk
    selectedDate: v.string(),      // ISO date string (e.g. '2025-06-25')
    paymentId: v.string(), 
    vendorId: v.string(),      // vendor ID for future communication  
    status:v.string()      // Razorpay payment ID
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error('Unauthorized'); // ensure booking is done by a logged-in user

    // Get the service to fetch vendorId for future vendor-user communication
    const service = await ctx.db.get(args.serviceId);
    if (!service) throw new Error('Service not found');

    const bookingId = await ctx.db.insert("bookings", {
      serviceId: args.serviceId,
      userId: args.userId,
      vendorId: service.vendorId,    
      selectedDate: args.selectedDate,
      paymentId: args.paymentId,
      
      status: args.status,          
    });

    return bookingId;
  },
});

export const getBookingsByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getBookingsForVendor = query({
  args: {
    vendorId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_vendor", (q) => q.eq("vendorId", args.vendorId))
      .order("desc")
      .collect();
  },
});
