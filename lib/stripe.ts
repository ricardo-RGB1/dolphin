import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true,
});

//  - The Stripe constructor takes two arguments:
// The first is the Stripe API key, and the second is an object containing the API version and whether or not to use TypeScript.
// We use the Stripe API key from the environment variables, and set the API version to the latest version available at the time of writing this book. We also set the typescript property to true, which enables TypeScript support in the Stripe library.
// This is optional, but recommended.
//  The Stripe constructor returns a Stripe object, which we export as stripe. We can then use this stripe object to call the Stripe API.  We will use this stripe object to create a Stripe session in api route.
