import { stripe } from "../../../lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db, messaging } from "../../../lib/firebaseAdmin";

// Ensure this route runs on Node.js runtime (Firebase Admin is not supported on Edge)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getReadablePaymentMethod(pm) {
  switch (pm.type) {
    case "card":
      if (pm.card.wallet) {
        // Apple Pay, Google Pay, etc.
        return pm.card.wallet.type;
      }
      return `${pm.card.brand} (card)`;

    case "amazon_pay":
      return "Amazon Pay";

    case "paypal":
      return "PayPal";

    case "ideal":
      return "iDEAL";

    case "sofort":
      return "SOFORT";

    default:
      return pm.type; // fallback, e.g. 'bancontact', 'alipay'
  }
}

export async function POST(req) {
  console.log("🎉🎉🚀Received webhook request:", req.method, req.url);

  // Ensure webhook secret exists
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Missing STRIPE_WEBHOOK_SECRET environment variable");
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET env var" },
      { status: 500 }
    );
  }

  // Get raw body (important for signature verification)
  let rawBody;
  try {
    rawBody = await req.text();
    console.log("Webhook raw body length:", rawBody?.length ?? 0);
  } catch (e) {
    console.error("Failed to read request body", e);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  // Fetch headers and verify signature
  const headersList = await headers();
  const signature =
    headersList.get("stripe-signature") || headersList.get("Stripe-Signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event;
  try {
    // Optional tolerance (seconds) to account for minor clock skew
    const tolerance = 300;
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
      tolerance
    );
  } catch (error) {
    console.error("Webhook signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle supported event types
  try {
    if (event.type !== "checkout.session.completed") {
      console.log("Received:", event.type, "- no action needed");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const session = event.data.object;
    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent,
      {
        expand: ["payment_method"],
      }
    );
    console.log("🚀⏳⛅Payment Intent:", paymentIntent);
    console.log("⛅⏳ Checkout session completed:", session);

    // Only persist successful paid sessions
    if (session.payment_status !== "paid") {
      console.log("Session not paid, skipping:", session.id);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const meta = session.metadata || {};
    const userId = meta.userId || meta.firebaseUserId || null;
    const moderatorId = meta.moderatorId || null;

    if (!userId) {
      console.warn("Missing userId in session metadata", session.id);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Idempotent write: mark processed in a transaction, only notify once
    const txRef = db
      .collection("users")
      .doc(userId)
      .collection("transactions")
      .doc(session.id);

    let shouldNotify = false;
    await db.runTransaction(async (trx) => {
      const snap = await trx.get(txRef);
      const baseData = {
        createdAt: new Date(session.created * 1000),
        event: event.type,
        amount: session.amount_total / 100,
        appId: meta.appId || "",
        moderatorId: moderatorId || "",
        name: meta.coins || "",
        userEmail: session.customer_details?.email || "",
        userId: userId,
        userName: session.customer_details?.name || "",
        sessionId: session.id,
        status: "pending",
        payment_status: session.payment_status,
        country: session.customer_details?.address?.country || "",
        paymentMethod: getReadablePaymentMethod(paymentIntent.payment_method),
      };

      if (!snap.exists) {
        trx.set(txRef, {
          ...baseData,
          webhookProcessed: true,
          notified: false,
        });
        shouldNotify = true;
      } else {
        const data = snap.data() || {};
        if (!data.webhookProcessed) {
          trx.update(txRef, { webhookProcessed: true });
          shouldNotify = true;
        }
        // Always ensure core fields are up-to-date
        trx.set(txRef, baseData, { merge: true });
      }
    });

    // Fetch FCM tokens for the moderator (notify the moderator about the user's purchase)
    let tokens = [];
    let tokensField = "fcmToken"; // default field name in your schema
    if (moderatorId) {
      try {
        const modDoc = await db.collection("users").doc(moderatorId).get();
        const modData = modDoc.data();
        const raw = modData?.fcmToken ?? modData?.fcmTokens ?? [];
        const arr = Array.isArray(raw) ? raw : raw ? [raw] : [];
        tokens = Array.from(
          new Set(
            arr
              .filter((t) => typeof t === "string")
              .map((t) => t.trim())
              .filter(Boolean)
          )
        );
        tokensField = Array.isArray(modData?.fcmToken)
          ? "fcmToken"
          : modData?.fcmTokens
          ? "fcmTokens"
          : "fcmToken";
        console.log("⛈🌧☁⛅⏳ FCM tokens for moderator:", tokens);
      } catch (e) {
        console.warn("Failed to load moderator tokens", e);
      }
    }

    // Build notification
    const notification = {
      title: `قام ${session.customer_details?.name || "مستخدم"} بطلب شحن جديد!`,
      body: `تم استلام طلب شحن جديد من ${
        session.customer_details?.name || "مستخدم"
      } بمبلغ ${session.amount_total / 100} دولار.`,
    };

    // Send notifications only once
    if (shouldNotify && tokens.length > 0) {
      try {
        const multicast = { tokens, notification };
        const resp = await messaging.sendEachForMulticast(multicast);
        console.log(
          `Notifications: success=${resp.successCount}, failure=${resp.failureCount}`
        );

        // Prune invalid tokens
        const invalidIndexes = resp.responses
          .map((r, i) => (r.error ? { i, code: r.error.code } : null))
          .filter(Boolean);

        const invalidCodes = new Set([
          "messaging/registration-token-not-registered",
          "messaging/invalid-registration-token",
        ]);

        const toRemove = new Set(
          invalidIndexes
            .filter((x) => invalidCodes.has(x.code))
            .map((x) => tokens[x.i])
        );

        if (toRemove.size > 0 && moderatorId) {
          const pruned = tokens.filter((t) => !toRemove.has(t));
          await db
            .collection("users")
            .doc(moderatorId)
            .set({ [tokensField]: pruned }, { merge: true });
          console.log("Pruned invalid FCM tokens:", Array.from(toRemove));
        }

        // Mark the transaction as notified
        await txRef.set({ notified: true }, { merge: true });
      } catch (e) {
        console.error("Failed to send FCM notifications", e);
      }
    } else if (shouldNotify && tokens.length === 0) {
      console.log("No FCM tokens available for moderator:", moderatorId);
    }

    console.log("Webhook handling completed for:", session.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (handlerErr) {
    console.error("Handler error", handlerErr);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }
}
