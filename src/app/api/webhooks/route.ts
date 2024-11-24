import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { env } from "@/env";
import { users } from "@/server/db/schema";
import { db } from "@/server/db";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const SIGNING_SECRET = env.SIGNING_SECRET;

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload: unknown = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  if (evt.type === "user.created") {
    const name =
      evt.data.first_name && evt.data.last_name
        ? `${evt.data.first_name} ${evt.data.last_name}`
        : (evt.data.first_name ?? evt.data.last_name ?? "User");
    await db.insert(users).values({
      id: evt.data.id,
      name,
      email: evt.data.email_addresses[0]?.email_address,
    });
  }

  if (evt.type === "user.updated") {
    const name =
      evt.data.first_name && evt.data.last_name
        ? `${evt.data.first_name} ${evt.data.last_name}`
        : (evt.data.first_name ?? evt.data.last_name ?? "User");
    await db
      .update(users)
      .set({
        name,
        email: evt.data.email_addresses[0]?.email_address,
      })
      .where(eq(users.id, evt.data.id));
  }

  if (evt.type === "user.deleted" && evt.data.id) {
    await db.delete(users).where(eq(users.id, evt.data.id));
  }

  return new NextResponse("Webhook received", { status: 200 });
}
