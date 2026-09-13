"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Container,
  Stack,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import type { CreateInquiryInput } from "@mafan/types";

type Status = "idle" | "submitting" | "success" | "error";

export const InquiryForm = () => {
  const [form, setForm] = useState<CreateInquiryInput>({
    name: "",
    email: "",
    childName: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      setForm({ name: "", email: "", childName: "", message: "" });
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
        <form onSubmit={handleSubmit}>
          <Stack gap="sm">
            <TextInput
              label="Your name"
              required
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  name: event.currentTarget.value,
                }))
              }
            />
            <TextInput
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  email: event.currentTarget.value,
                }))
              }
            />
            <TextInput
              label="Child's first name (optional)"
              value={form.childName}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  childName: event.currentTarget.value,
                }))
              }
            />
            <Textarea
              label="Tell us about the drawing"
              placeholder="e.g. Please keep the pink dress and the yellow crown."
              autosize
              minRows={3}
              value={form.message}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  message: event.currentTarget.value,
                }))
              }
            />
            {status === "error" && (
              <Alert color="error" title="Something went wrong">
                Please try again or email us directly.
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
