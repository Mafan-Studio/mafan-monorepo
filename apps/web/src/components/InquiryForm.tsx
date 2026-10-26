"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  FileInput,
  Image,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  ALLOWED_INQUIRY_IMAGE_TYPES,
  INQUIRY_ERROR_CODES,
  MAX_INQUIRY_EMAIL_LENGTH,
  MAX_INQUIRY_IMAGE_BYTES,
  MAX_INQUIRY_MESSAGE_LENGTH,
  MAX_INQUIRY_NAME_LENGTH,
  isValidEmail,
  isValidInstagramHandle,
  type CreateInquiryInput,
  type InquiryErrorCode,
  type Locale,
} from "@mafan/types";
import { colors } from "@mafan/tokens";
import type { Dictionary } from "@/i18n/getDictionary";

type Status = "idle" | "submitting" | "success" | "error";

const isInquiryErrorCode = (value: unknown): value is InquiryErrorCode =>
  typeof value === "string" &&
  (INQUIRY_ERROR_CODES as readonly string[]).includes(value);

interface InquiryFormProps {
  locale: Locale;
  strings: Dictionary["form"];
}

export const InquiryForm = ({ locale, strings }: InquiryFormProps) => {
  const [status, setStatus] = useState<Status>("idle");
  const [errorCode, setErrorCode] = useState<InquiryErrorCode>("server_error");
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  // Real visitors never see or fill this in; bots that blindly fill every
  // field do. Non-empty value = pretend success, submit nothing.
  const [honeypot, setHoneypot] = useState("");

  const tooLong = (value: string, max: number) =>
    value.trim().length > max ? strings.errors.field_too_long : null;

  const form = useForm<CreateInquiryInput>({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      instagramHandle: "",
      childName: "",
      message: "",
    },
    validate: {
      email: (value, values) => {
        if (!value.trim() && !values.instagramHandle.trim()) {
          return strings.errors.contact_required;
        }
        if (value.trim() && !isValidEmail(value)) {
          return strings.errors.invalid_email;
        }
        return tooLong(value, MAX_INQUIRY_EMAIL_LENGTH);
      },
      instagramHandle: (value) =>
        value.trim() && !isValidInstagramHandle(value)
          ? strings.errors.invalid_instagram
          : null,
      name: (value) => tooLong(value, MAX_INQUIRY_NAME_LENGTH),
      childName: (value) => tooLong(value, MAX_INQUIRY_NAME_LENGTH),
      message: (value) => tooLong(value, MAX_INQUIRY_MESSAGE_LENGTH),
    },
  });

  const previewUrl = useMemo(
    () => (image ? URL.createObjectURL(image) : null),
    [image],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (file: File | null) => {
    if (file && !ALLOWED_INQUIRY_IMAGE_TYPES.includes(file.type as never)) {
      setImageError(strings.errors.image_type);
      setImage(null);
      return;
    }
    if (file && file.size > MAX_INQUIRY_IMAGE_BYTES) {
      setImageError(strings.errors.image_too_large);
      setImage(null);
      return;
    }
    setImageError(null);
    setImage(file);
  };

  const handleSubmit = async (values: CreateInquiryInput) => {
    if (honeypot.trim() !== "") {
      setStatus("success");
      return;
    }

    if (!image) {
      setImageError(strings.errors.image_required);
      return;
    }

    setStatus("submitting");

    try {
      const body = new FormData();
      body.append("locale", locale);
      body.append("image", image);
      body.append("company", honeypot);
      for (const [field, value] of Object.entries(values)) {
        if (value.trim()) {
          body.append(field, value.trim());
        }
      }

      const response = await fetch("/api/inquiries", {
        method: "POST",
        body,
      });

      if (!response.ok) {
        const payload: unknown = await response.json().catch(() => null);
        const code =
          payload && typeof payload === "object" && "error" in payload
            ? payload.error
            : null;
        setErrorCode(isInquiryErrorCode(code) ? code : "server_error");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
      setImage(null);
    } catch {
      setErrorCode("server_error");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <Alert color="success" title={strings.successTitle}>
        {strings.successText}
      </Alert>
    );
  }

  return (
    <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="sm">
        <FileInput
          label={strings.drawingLabel}
          placeholder={strings.drawingPlaceholder}
          required
          accept={ALLOWED_INQUIRY_IMAGE_TYPES.join(",")}
          value={image}
          onChange={handleImageChange}
          error={imageError}
          clearable
        />
        {previewUrl && (
          <Image
            src={previewUrl}
            alt={strings.previewAlt}
            radius="sm"
            mah={200}
            w="auto"
            fit="contain"
          />
        )}

        <Text size="sm" c={colors.neutral.secondaryInk}>
          {strings.contactHint}
        </Text>
        <TextInput
          label={strings.emailLabel}
          type="email"
          dir="ltr"
          autoComplete="email"
          maxLength={MAX_INQUIRY_EMAIL_LENGTH}
          key={form.key("email")}
          {...form.getInputProps("email")}
        />
        <TextInput
          label={strings.instagramLabel}
          placeholder={strings.instagramPlaceholder}
          dir="ltr"
          autoComplete="off"
          maxLength={31}
          key={form.key("instagramHandle")}
          {...form.getInputProps("instagramHandle")}
        />
        <TextInput
          label={strings.nameLabel}
          autoComplete="name"
          maxLength={MAX_INQUIRY_NAME_LENGTH}
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        <TextInput
          label={strings.childNameLabel}
          description={strings.childNameHint}
          maxLength={MAX_INQUIRY_NAME_LENGTH}
          key={form.key("childName")}
          {...form.getInputProps("childName")}
        />
        <Textarea
          label={strings.messageLabel}
          placeholder={strings.messagePlaceholder}
          autosize
          minRows={3}
          maxLength={MAX_INQUIRY_MESSAGE_LENGTH}
          key={form.key("message")}
          {...form.getInputProps("message")}
        />

        <TextInput
          name="company"
          value={honeypot}
          onChange={(event) => setHoneypot(event.currentTarget.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{
            position: "absolute",
            left: -9999,
            width: 1,
            height: 1,
            overflow: "hidden",
          }}
        />

        {status === "error" && (
          <Alert color="error" title={strings.errorTitle}>
            {strings.errors[errorCode]}
          </Alert>
        )}
        <Text size="xs" c={colors.neutral.secondaryInk}>
          {strings.privacy}
        </Text>
        <Button
          type="submit"
          color="pink"
          radius="xl"
          loading={status === "submitting"}
        >
          {strings.submit}
        </Button>
      </Stack>
    </form>
  );
};
