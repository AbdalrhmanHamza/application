import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "../../../../lib/stripe";

export async function POST(req, { params }) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");
    // Safely read and parse JSON body
    const rawBody = await req.text();
    if (!rawBody) {
      console.error("Empty request body");
      return NextResponse.json(
        { error: "Empty request body" },
        { status: 400 }
      );
    }
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseErr) {
      console.error("Invalid JSON in request body:", parseErr);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const { price, coins, productId, email, name, appId, moderator, uid } =
      body; // added email
    // basic validation
    if (typeof price !== "number" || typeof coins !== "number") {
      return NextResponse.json(
        { error: "Invalid price or coins" },
        { status: 400 }
      );
    }

    // Get the id from the dynamic route
    const { id } = await params;

    console.log("creating customer: ");
    console.log("name: ", name);

    const customer = await stripe.customers.create({
      name: name || "Guest",
      email: email || undefined,
      metadata: {
        userId: uid || "",
      },
    });
    console.log("Customer created:", customer, "ID:", customer.id);

    console.log("Creating checkout session for product:", productId || id);

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          // Use the ID from the route or fallback to productId from body
          price_data: {
            currency: "usd",
            unit_amount: price * 100, // Convert to cents
            product_data: {
              name: `Purchase ${coins} coins`,
              description: `Purchase ${coins} coins`,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?appId=${appId}&moderator=${moderator}`,
      cancel_url: `${origin}/marketplace`,
      automatic_tax: { enabled: true },
      // Persist address and shipping for tax calculation
      customer_update: {
        address: "auto",
        shipping: "auto",
      },
      metadata: {
        productId: productId || id || "",
        coins: String(coins),
        appId: appId || "",
        moderatorId: moderator || "",
        userEmail: email,
        userId: uid,
      },
    });
    console.log("Checkout session created:", session.url);
    if (!session.url) throw new Error("Session URL is null");
    // Return the session URL to the client instead of redirecting
    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}
