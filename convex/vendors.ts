import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const newVendor = mutation({
 args:{
  name: v.string(),
  vendorId: v.string(),
  email: v.string(),
 },
 handler:async(ctx,{name,vendorId,email})=>{
    try{
       const existingVendor=await ctx.db.query("vendors").filter(q => q.eq("vendorId", vendorId)).first();
       if(existingVendor)
       {
        return existingVendor
       }
       const newVendor=await ctx.db.insert("vendors",{
        name,
        vendorId

        ,email})
        return newVendor;
    }
    catch(e){

    }
 }
})
export const getAllVendors = query({
  handler: async (ctx) => {
    return await ctx.db.query("vendors").collect();
  }         
});