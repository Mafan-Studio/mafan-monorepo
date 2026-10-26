import type { Locale } from "./locale";

export interface Inquiry {
  id: string;
  name?: string;
  email?: string;
  instagramHandle?: string;
  childName?: string;
  message?: string;
  imagePath?: string;
  locale: Locale;
  createdAt: string;
}

export interface CreateInquiryInput {
  name: string;
  email: string;
  instagramHandle: string;
  childName: string;
  message: string;
}

export const MAX_INQUIRY_IMAGE_BYTES = 8 * 1024 * 1024;

export const ALLOWED_INQUIRY_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
] as const;

export const MAX_INQUIRY_NAME_LENGTH = 100;
export const MAX_INQUIRY_EMAIL_LENGTH = 254;
export const MAX_INQUIRY_MESSAGE_LENGTH = 2000;

// Instagram usernames: 1-30 letters, digits, periods and underscores. A
// leading "@" is accepted from the visitor but never stored.
export const INSTAGRAM_HANDLE_PATTERN = /^@?[A-Za-z0-9._]{1,30}$/;

export const isValidInstagramHandle = (value: string) =>
  INSTAGRAM_HANDLE_PATTERN.test(value.trim());

export const normalizeInstagramHandle = (value: string) =>
  value.trim().replace(/^@/, "");

// Loose on purpose: real validation is "can we reply to it", not RFC 5322.
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value: string) => EMAIL_PATTERN.test(value.trim());

// Language-neutral error codes returned by /api/inquiries as
// `{ error: code }`; the form maps each one to translated text.
export const INQUIRY_ERROR_CODES = [
  "contact_required",
  "invalid_email",
  "invalid_instagram",
  "field_too_long",
  "image_required",
  "image_type",
  "image_too_large",
  "rate_limited",
  "server_error",
] as const;

export type InquiryErrorCode = (typeof INQUIRY_ERROR_CODES)[number];
