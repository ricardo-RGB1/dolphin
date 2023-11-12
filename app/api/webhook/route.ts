import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text(); 
  const signature = headers().get("Stripe-Signature") as string; // get Stripe-Signature header from request

  let event: Stripe.Event; // Stripe event

  try {
    event = stripe.webhooks.constructEvent( 
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session; 
  const userId = session?.metadata?.userId; 
  const courseId = session?.metadata?.courseId;

  // Handle the event 
  if (event.type === "checkout.session.completed") { 
    if (!userId || !courseId) { // check if userId and courseId are present in metadata
      return new NextResponse(`Webhook Error: Missing metadata`, {
        status: 400,
      });
    }

    await db.purchase.create({ // create purchase record in database
      data: {
        courseId: courseId, 
        userId: userId, 
      },
    });
  } else {
    return new NextResponse(
      `Webhook Error: Unhandled event type ${event.type}`,
      { status: 200 }
    );
  }

  return new NextResponse(null, { status: 200 }); 
}
