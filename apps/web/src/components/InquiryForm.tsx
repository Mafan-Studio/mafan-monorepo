"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Container,
  FileInput,
  Image,
  Stack,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";
import {
  ALLOWED_INQUIRY_IMAGE_TYPES,
  MAX_INQUIRY_IMAGE_BYTES,
  type CreateInquiryInput,
} from "@mafan/types";

type Status = "idle" | "submitting" | "success" | "error" | "rate-limited";

export const InquiryForm = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  // Real visitors never see or fill this in; bots that blindly fill every
  // field do. Non-empty value = pretend success, submit nothing.
  const [honeypot, setHoneypot] = useState("");

  const form = useForm<CreateInquiryInput>({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      childName: "",
      message: "",
    },
    validate: {
      name: isNotEmpty("Please enter your name"),
      email: isEmail("Please enter a valid email"),
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
      setImageError("Please upload a JPEG, PNG, WEBP, or HEIC image");
      setImage(null);
      return;
    }
    if (file && file.size > MAX_INQUIRY_IMAGE_BYTES) {
      setImageError("Image must be smaller than 8MB");
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
      setImageError("Please upload a photo of the drawing");
      return;
    }

    setStatus("submitting");

    try {
      const body = new FormData();
      body.append("name", values.name);
      body.append("email", values.email);
      if (values.childName) {
        body.append("childName", values.childName);
      }
      if (values.message) {
        body.append("message", values.message);
      }
      body.append("image", image);
      body.append("company", honeypot);

      const response = await fetch("/api/inquiries", {
        method: "POST",
        body,
      });

      if (response.status === 429) {
        setStatus("rate-limited");
        return;
      }

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      form.reset();
      setImage(null);
    } catch {
      setStatus("error");
    }
  };

  return (
    <Container size="xs" id="inquiry" py="xl">
      <Title order={2} mb="md" ta="center">
        Start Your Creation
      </Title>

      {status === "success" ? (
        <Alert color="success" title="We've received your drawing!">
          Mafan will review it and get back to you with a quote soon.
        </Alert>
      ) : (
        <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Your name"
              required
              key={form.key("name")}
              {...form.getInputProps("name")}
            />
            <TextInput
              label="Email"
              type="email"
              required
              key={form.key("email")}
              {...form.getInputProps("email")}
            />
            <TextInput
              label="Child's first name (optional)"
              key={form.key("childName")}
              {...form.getInputProps("childName")}
            />
            <FileInput
              label="Photo of the drawing"
              placeholder="Upload a photo or scan"
              required
              accept="image/jpeg,image/png,image/webp,image/heic"
              value={image}
              onChange={handleImageChange}
              error={imageError}
              clearable
            />
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="Preview of the uploaded drawing"
                radius="sm"
                mah={200}
                w="auto"
                fit="contain"
              />
            )}
            <Textarea
              label="Tell us about the drawing"
              placeholder="e.g. Please keep the pink dress and the yellow crown."
              autosize
              minRows={3}
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
              <Alert color="error" title="Something went wrong">
                Please try again or email us directly.
              </Alert>
            )}
            {status === "rate-limited" && (
              <Alert color="error" title="Too many attempts">
                Please wait a bit before submitting again.
              </Alert>
            )}
            <Button
              type="submit"
              color="pink"
              loading={status === "submitting"}
            >
              Submit
            </Button>
          </Stack>
        </form>
      )}
    </Container>
  );
};
