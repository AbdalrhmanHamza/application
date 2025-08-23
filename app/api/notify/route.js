import { NextResponse } from "next/server";
import { messaging } from "../../../lib/firebaseAdmin";

// Ensure Node runtime (Admin SDK not supported on Edge)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Basic CORS (adjust origins as needed)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req) {
  try {
    // Parse JSON safely
    let data;
    try {
      data = await req.json();
      console.log("Notification request data:", data);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Support single token or tokens array
    const rawTokens = Array.isArray(data?.tokens)
      ? data.tokens
      : data?.token
      ? [data.token]
      : [];

    const tokens = Array.from(
      new Set(
        rawTokens
          .filter((t) => typeof t === "string")
          .map((t) => t.trim())
          .filter(Boolean)
      )
    );

    const title = typeof data?.title === "string" ? data.title : "";
    const body = typeof data?.body === "string" ? data.body : "";

    if (tokens.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing FCM token(s)" },
        { status: 400, headers: corsHeaders }
      );
    }
    if (!title || !body) {
      return NextResponse.json(
        { success: false, error: "Missing title or body" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Send using multicast (works for 1..500 tokens)
    console.log(`Sending notification to ${tokens.length} token(s)`);
    const resp = await messaging.sendEachForMulticast({
      tokens,
      notification: { title, body },
    });
    console.log("Notification response:", resp);

    const successCount = resp.successCount;
    const failureCount = resp.failureCount;
    const errors = resp.responses
      .map((r, i) =>
        r.error
          ? { token: tokens[i], code: r.error.code, message: r.error.message }
          : null
      )
      .filter(Boolean);

    const anySuccess = successCount > 0;

    console.log(
      `Notifications: success=${successCount}, failure=${failureCount}`
    );

    // Always return 200; caller inspects per-token results
    return NextResponse.json(
      {
        success: anySuccess,
        successCount,
        failureCount,
        errors,
        note: !anySuccess
          ? "All tokens failed. Check errors[] for details (e.g., invalid or not-registered)."
          : undefined,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Unknown error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
