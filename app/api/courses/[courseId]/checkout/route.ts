import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } } // extract courseId from URL
) {
  try {
    const user = await currentUser();

    // Check if user is authenticated and authorized
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Retrieve course information from database
    // Check if course exists and is published (can only purchase published courses)
    const course = await db.course.findUnique({
      where: {
        id: params.courseId, // courseId from URL
        isPublished: true,
      },
    });

    // Check if user has already purchased the course
    // by checking if there is a purchase record in the database
    // with the same userId and courseId as the current user and course
    // i.e., does the userId_courseId composite key match the current user and course?
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          // composite key
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Create Stripe session with course information
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];

    
    // Check if user has a Stripe customer ID in the database: ****
    // a) The where property is used to find a stripeCustomer record with the same userId as the current user.
    // b) Only the stripeCustomerId field of the stripeCustomer object will be returned by the query.
    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true, // only select stripeCustomerId
      },
    });

    // If not, create a Stripe customer for someone purchasing for the first time.
    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });
      // Create a new Stripe customer record in the database
      // with the user ID and Stripe customer ID
      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
      });
    }

    // Create Stripe checkout session with course information
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
      metadata: { // store course ID and user ID in Stripe session metadata
        courseId: course.id,
        userId: user.id,
      },
    });

    return NextResponse.json({ url: session.url }); // Redirect to Stripe
  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// The POST function is an asynchronous function that handles the HTTP POST request to purchase a course. It takes in two parameters: req, which is the request object, and params, which is an object containing the courseId parameter.

// The function first checks if the user is authenticated and authorized to make the purchase. If not, it returns a 401 Unauthorized response.

// Then, it checks if the user has already purchased the course. If so, it returns a 400 Bad Request response.

// Next, it retrieves the course information from the database and creates a Stripe checkout session with the course information.

// If the user does not have a Stripe customer ID, it creates a new customer in Stripe and saves the customer ID in the database.

// Finally, it returns a JSON response containing the URL of the Stripe checkout session.

// If any errors occur during the process, it returns a 500 Internal Server Error response.