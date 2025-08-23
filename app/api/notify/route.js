import { NextResponse } from "next/server";
import { messaging } from "../../../lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { token, title, body } = await req.json();

    const message = {
      token,
      notification: {
        title,
        body,
      },
    };
    const response = await messaging.send(message);
    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
