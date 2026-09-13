import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  ALLOWED_INQUIRY_IMAGE_TYPES,
  MAX_INQUIRY_IMAGE_BYTES,
} from "@mafan/types";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_SUBMISSIONS = 3;

const getClientIp = (request: Request): string => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]!.trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
};

const sanitizeFileName = (name: string) =>
  name.replace(/[^a-zA-Z0-9_.-]/g, "_").slice(-100);

export async function POST(request: Request) {
  const formData = await request.formData();

  // Honeypot: real users never see or fill this field. Bots that
  // auto-fill every input do. Report success without doing anything, so
  // the bot has no signal that it was caught.
  const honeypot = formData.get("company");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const ip = getClientIp(request);
  const cutoff = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const { count, error: rateLimitError } = await supabaseAdmin
    .from("inquiries")
    .select("id", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("created_at", cutoff);

  if (rateLimitError) {
    console.error("Failed to check rate limit", rateLimitError);
  } else if ((count ?? 0) >= RATE_LIMIT_MAX_SUBMISSIONS) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const name = formData.get("name");
  const email = formData.get("email");
  const childName = formData.get("childName");
  const message = formData.get("message");
  const image = formData.get("image");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    !name ||
    !email
  ) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 },
    );
  }

  if (!(image instanceof File) || image.size === 0) {
    return NextResponse.json(
      { error: "A photo of the drawing is required" },
      { status: 400 },
    );
  }

  if (!ALLOWED_INQUIRY_IMAGE_TYPES.includes(image.type as never)) {
    return NextResponse.json(
      { error: "Please upload a JPEG, PNG, WEBP, or HEIC image" },
      { status: 400 },
    );
  }

  if (image.size > MAX_INQUIRY_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Image must be smaller than 8MB" },
      { status: 400 },
    );
  }

  const imagePath = `${randomUUID()}-${sanitizeFileName(image.name)}`;
  const { error: uploadError } = await supabaseAdmin.storage
    .from("inquiry-drawings")
    .upload(imagePath, await image.arrayBuffer(), {
      contentType: image.type,
    });

  if (uploadError) {
    console.error("Failed to upload inquiry image", uploadError);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }

  const { error } = await supabaseAdmin.from("inquiries").insert({
    name,
    email,
    child_name: typeof childName === "string" ? childName : undefined,
    message: typeof message === "string" ? message : undefined,
    image_path: imagePath,
    ip_address: ip,
  });

  if (error) {
    console.error("Failed to store inquiry", error);
    return NextResponse.json(
      { error: "Failed to store inquiry" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
