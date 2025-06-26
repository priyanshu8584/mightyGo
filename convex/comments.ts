// convex/comments.ts

import { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const add = mutation({
  args: {
    serviceId: v.id('services'),
    userId:v.string(),
    content: v.string(),
    rating: v.optional(v.number()),
    parentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error('Unauthorized');

    // Validate rating
    if (args.rating && (args.rating < 1 || args.rating > 5)) {
      throw new Error('Rating must be between 1-5');
    }

    const commentId = await ctx.db.insert('comments', {
      serviceId: args.serviceId,
      userId: args.userId,
      content: args.content,
      rating: args.rating,
      parentId: args.parentId,
      createdAt: Date.now(),
    });

    // Update service rating average if rating provided
    if (args.rating) {
      await updateServiceRating(ctx, args.serviceId);
    }

    return commentId;
  },
});
async function updateServiceRating(ctx: any, serviceId: Id<'services'>) {
  const serviceDoc = await ctx.db.get(serviceId); // ✅ Correct way to get service by _id
  if (!serviceDoc) {
    throw new Error('Service not found');
  }

  const comments = await ctx.db
    .query('comments')
    .withIndex('by_service', (q:any) => q.eq('serviceId', serviceId))
    .collect();

  const ratedComments = comments.filter((c: any) => c.rating !== undefined);

  const newAverage = ratedComments.length > 0
    ? ratedComments.reduce((sum: number, c: any) => sum + (c.rating || 0), 0) / ratedComments.length
    : 0;

  await ctx.db.patch(serviceId, {   
    ratingAverage: newAverage,
    ratingCount: ratedComments.length,
  });
}

export const getCommentsByService = query({
  args: {
    serviceId: v.id('services'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('comments')
      .withIndex('by_service', (q) => q.eq('serviceId', args.serviceId))
      .order('desc') // latest first
      .collect();
  },
});