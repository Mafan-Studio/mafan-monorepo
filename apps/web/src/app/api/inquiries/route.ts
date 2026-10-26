import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  ALLOWED_INQUIRY_IMAGE_TYPES,
  DEFAULT_LOCALE,
  MAX_INQUIRY_EMAIL_LENGTH,
  MAX_INQUIRY_IMAGE_BYTES,
  MAX_INQUIRY_MESSAGE_LENGTH,
  MAX_INQUIRY_NAME_LENGTH,
  isLocale,
  isValidEmail,
  isValidInstagramHandle,
  normalizeInstagramHandle,
  type InquiryErrorCode,
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

// Errors are language-neutral codes; the form shows them translated.
const fail = (error: InquiryErrorCode, status: number) =>
  NextResponse.json({ error }, { status });

// Empty or missing optional fields become undefined (stored as null).
const optionalText = (formData: FormData, field: string) => {
  const value = formData.get(field);
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
};

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
    return fail("rate_limited", 429);
  }

  const name = optionalText(formData, "name");
  const email = optionalText(formData, "email");
  const rawInstagramHandle = optionalText(formData, "instagramHandle");
  const childName = optionalText(formData, "childName");
  const message = optionalText(formData, "message");
  const rawLocale = formData.get("locale");
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const image = formData.get("image");

  if (!email && !rawInstagramHandle) {
    return fail("contact_required", 400);
  }

  if (
    (name?.length ?? 0) > MAX_INQUIRY_NAME_LENGTH ||
    (childName?.length ?? 0) > MAX_INQUIRY_NAME_LENGTH ||
    (email?.length ?? 0) > MAX_INQUIRY_EMAIL_LENGTH ||
    (message?.length ?? 0) > MAX_INQUIRY_MESSAGE_LENGTH
  ) {
    return fail("field_too_long", 400);
  }

  if (email && !isValidEmail(email)) {
    return fail("invalid_email", 400);
  }

  if (rawInstagramHandle && !isValidInstagramHandle(rawInstagramHandle)) {
    return fail("invalid_instagram", 400);
  }

  if (!(image instanceof File) || image.size === 0) {
    return fail("image_required", 400);
  }

  if (!ALLOWED_INQUIRY_IMAGE_TYPES.includes(image.type as never)) {
    return fail("image_type", 400);
  }

  if (image.size > MAX_INQUIRY_IMAGE_BYTES) {
    return fail("image_too_large", 400);
  }

  const imagePath = `${randomUUID()}-${sanitizeFileName(image.name)}`;
  const { error: uploadError } = await supabaseAdmin.storage
    .from("inquiry-drawings")
    .upload(imagePath, await image.arrayBuffer(), {
      contentType: image.type,
    });

  if (uploadError) {
    console.error("Failed to upload inquiry image", uploadError);
    return fail("server_error", 500);
  }

  const { error } = await supabaseAdmin.from("inquiries").insert({
    name,
    email,
    instagram_handle: rawInstagramHandle
      ? normalizeInstagramHandle(rawInstagramHandle)
      : undefined,
    child_name: childName,
    message,
    image_path: imagePath,
    ip_address: ip,
    locale,
  });

  if (error) {
    console.error("Failed to store inquiry", error);
    return fail("server_error", 500);
  }

  return NextResponse.json({ ok: true });
}
