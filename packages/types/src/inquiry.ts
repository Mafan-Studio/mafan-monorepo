export interface Inquiry {
  id: string;
  name: string;
  email: string;
  childName?: string;
  message?: string;
  imagePath?: string;
  createdAt: string;
}

export interface CreateInquiryInput {
  name: string;
  email: string;
  childName?: string;
  message?: string;
}

export const MAX_INQUIRY_IMAGE_BYTES = 8 * 1024 * 1024;

export const ALLOWED_INQUIRY_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
] as const;
