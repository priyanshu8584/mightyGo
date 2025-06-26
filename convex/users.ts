import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserById = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();
  },
});

export const newUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
   role: v.optional(v.string()),
  },
  handler: async (ctx, { userId, name, email,role }) => {
  try {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, { name, email });
      return existingUser._id;
    }

    const newUser = await ctx.db.insert("users", {
      userId,
      name,
      email,
      role:'user'
    });

    return newUser;
  } catch (error) {
    console.error("Error in newUser mutation:", error);
    throw new Error("Failed to create or update user");
  }
}

});
export const getUsersByVendorId = query({
  args: { vendorId: v.string() },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_vendor", (q) => q.eq("vendorId", args.vendorId))
      .collect();

    const userIds = [...new Set(bookings.map((b) => b.userId))];

    const users = await Promise.all(
      userIds.map((uid) =>
        ctx.db.query("users").withIndex("by_user_id", (q) => q.eq("userId", uid)).unique()
      )
    );

    return users.filter(Boolean); // remove nulls
  },
});