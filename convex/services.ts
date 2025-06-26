import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
export const getAllServices = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, { category }) => {
    let query = ctx.db.query("services").order("desc")

    if (category) {
      query = query.filter((q) => q.eq("category", category));
    }

    return await query.collect();
  },
})
export const getServiceByIdOnly = query({
  args: { serviceId: v.string() },
  handler: async (ctx, { serviceId }) => {
    const service = await ctx.db
      .query("services")
      .filter(q => q.eq(q.field("_id"), serviceId))
      .first();
    return service;
  }
});

export const getServiceById = query({
  args: {
    vendorId: v.string(),
  },
  handler: async (ctx, { vendorId }) => {
    const service = await ctx.db
      .query("services")
      .withIndex("by_vendor_id", (q) => q.eq("vendorId", vendorId)) // Corrected this line
      .collect();

    if (!service) throw new Error("Service not found");

    return service;
  },
});
export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async ({ storage }, { storageId }) => {
    return await storage.getUrl(storageId); // ✅ Not deprecated in query
  },
});
export const addService = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    vendorId: v.string(),
    vendorName: v.string(),
    duration: v.optional(v.number()), 
    phoneNumber: v.optional(v.string()),
    address: v.optional(v.string()),
    photos: v.optional(v.array(v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check if user is a vendor
    // const vendor = await ctx.db
    //   .query("vendors")
    //   .withIndex("by_vendor_id", (q) => q.eq("vendorId", identity.subject))
    //   .collect();

    // if (!vendor) throw new Error("Not a registered vendor");

   await ctx.db.insert("services", {
  name: args.name,
  description: args.description,
  price: args.price,
  category: args.category,
  createdAt: Date.now(),
  vendorId: args.vendorId,
  vendorName: args.vendorName,
  duration: args.duration ?? 0,
  phoneNumber: args.phoneNumber ?? "",
  address: args.address ?? "",
   photos: args.photos ?? []
});

return "Service posted successfully";
  }
});
export const deleteService = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
export const getServiceByIdForEdit = query({
  args: { serviceId: v.id('services') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.serviceId);
  }
});
export const updateService = mutation({
  args: {
    serviceId: v.id('services'),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    duration: v.optional(v.number()),
    phoneNumber: v.optional(v.string()),
    address: v.optional(v.string()),
    category: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.serviceId, {
      name: args.name,
      description: args.description,
      price: args.price,
      duration: args.duration ?? 0,
      phoneNumber: args.phoneNumber ?? "",
      address: args.address ?? "",
      category: args.category
    });
  }
});
