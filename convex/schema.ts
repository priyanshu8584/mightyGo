import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { add } from "date-fns";
import { vendored } from "next/dist/server/route-modules/pages/module.compiled";
export default defineSchema({
   users:defineTable({
      name:v.string(),
      userId:v.string(),
      email:v.string(),
     role:v.optional(v.string()),

  
   })  .index("by_user_id", ["userId"])
   .index("by_email", ["email"]),
    vendors: defineTable({
    name: v.string(),
    vendorId: v.string(), 
    email: v.string(),
  }).index("by_vendor_id", ["vendorId"]),
   services: defineTable({
      name: v.string(),
      description: v.string(),
      price: v.number(),
      category: v.string(),
      createdAt: v.number(),
      vendorName: v.string(),
      vendorId: v.string(),
      phoneNumber: v.optional(v.string()),
      address: v.optional(v.string()),
      duration: v.optional(v.number()),
      photos:v.optional(v.array(v.id("_storage"))),
    ratingAverage: v.optional(v.number()),
    ratingCount: v.optional(v.number()),
   }).index("by_vendor_id", ["vendorId"]),
 
  comments: defineTable({
    serviceId: v.id("services"),
    userId: v.string(),
    content: v.string(),
    rating: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    parentId: v.optional(v.string()),
})
.index('by_service', ['serviceId'])
.index('by_user', ['userId'])
.index('by_parent', ['parentId']),
 bookings: defineTable({
  serviceId: v.id('services'),
  userId: v.string(),
  vendorId: v.string(),
  selectedDate: v.string(), 
  paymentId: v.string(),
  status: v.string(),
}).index("by_user", ["userId"])
.index("by_vendor", ["vendorId"])
});
   

