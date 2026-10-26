import { render, screen, fireEvent } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Locale } from "@mafan/types";
import en from "@/i18n/dictionaries/en.json";
import fa from "@/i18n/dictionaries/fa.json";
import { InquiryForm } from "./InquiryForm";

const renderForm = (locale: Locale = "en", strings = en.form) =>
  render(
    <MantineProvider>
      <InquiryForm locale={locale} strings={strings} />
    </MantineProvider>,
  );

// Mantine renders required-field labels as e.g. "Photo of the drawing *"
// (the asterisk is a visually-hidden child span), so exact text matching
// fails here even though it doesn't in a real browser. Partial matching
// sidesteps that.
const getField = (label: string) =>
  screen.getByLabelText(label, { exact: false });

const testImage = () =>
  new File(["fake image content"], "drawing.png", { type: "image/png" });

// Mantine's FileInput associates the label with the visible trigger
// button, not the hidden native <input type="file">, so getByLabelText
// can't find it — query the real input directly.
const getImageInput = (container: HTMLElement) =>
  container.querySelector('input[type="file"]') as HTMLInputElement;

const submitButton = (strings = en.form) =>
  screen.getByRole("button", { name: strings.submit });

const lastRequestBody = () =>
  vi.mocked(fetch).mock.calls[0]![1]?.body as FormData;

describe("InquiryForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true } as Response));
  });

  it("asks for an email or Instagram handle when both are empty", async () => {
    const { container } = renderForm();

    fireEvent.change(getImageInput(container), {
      target: { files: [testImage()] },
    });
    fireEvent.click(submitButton());

    expect(
      await screen.findByText(en.form.errors.contact_required),
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("shows validation errors for an invalid email and handle", async () => {
    renderForm();

    fireEvent.change(getField(en.form.emailLabel), {
      target: { value: "not-an-email" },
    });
    fireEvent.change(getField(en.form.instagramLabel), {
      target: { value: "has space" },
    });
    fireEvent.click(submitButton());

    expect(
      await screen.findByText(en.form.errors.invalid_email),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(en.form.errors.invalid_instagram),
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("requires a photo even when contact details are valid", async () => {
    renderForm();

    fireEvent.change(getField(en.form.emailLabel), {
      target: { value: "parent@example.com" },
    });
    fireEvent.click(submitButton());

    expect(
      await screen.findByText(en.form.errors.image_required),
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("submits a handle-only inquiry with its locale and shows the success message", async () => {
    const { container } = renderForm();

    fireEvent.change(getField(en.form.instagramLabel), {
      target: { value: "@mila.draws" },
    });
    fireEvent.change(getField(en.form.childNameLabel), {
      target: { value: "Mila" },
    });
    fireEvent.change(getImageInput(container), {
      target: { files: [testImage()] },
    });
    fireEvent.click(submitButton());

    expect(await screen.findByText(en.form.successTitle)).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, options] = vi.mocked(fetch).mock.calls[0]!;
    expect(url).toBe("/api/inquiries");
    expect(options?.method).toBe("POST");

    const body = lastRequestBody();
    expect(body.get("instagramHandle")).toBe("@mila.draws");
    expect(body.get("childName")).toBe("Mila");
    expect(body.get("locale")).toBe("en");
    // Empty optional fields aren't sent at all.
    expect(body.has("email")).toBe(false);
    expect(body.has("name")).toBe(false);
    expect((body.get("image") as File).name).toBe("drawing.png");
  });

  it("shows the server's error code as a translated message", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({ error: "rate_limited" }),
    } as Response);
    const { container } = renderForm("fa", fa.form);

    fireEvent.change(getField(fa.form.emailLabel), {
      target: { value: "parent@example.com" },
    });
    fireEvent.change(getImageInput(container), {
      target: { files: [testImage()] },
    });
    fireEvent.click(submitButton(fa.form));

    expect(
      await screen.findByText(fa.form.errors.rate_limited),
    ).toBeInTheDocument();
    expect(lastRequestBody().get("locale")).toBe("fa");
  });

  it("falls back to a generic message for an unknown server error", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: "something_else" }),
    } as Response);
    const { container } = renderForm();

    fireEvent.change(getField(en.form.emailLabel), {
      target: { value: "parent@example.com" },
    });
    fireEvent.change(getImageInput(container), {
      target: { files: [testImage()] },
    });
    fireEvent.click(submitButton());

    expect(
      await screen.findByText(en.form.errors.server_error),
    ).toBeInTheDocument();
  });

  it("pretends to succeed without submitting when the honeypot field is filled", async () => {
    const { container } = renderForm();

    fireEvent.change(getField(en.form.emailLabel), {
      target: { value: "parent@example.com" },
    });
    fireEvent.change(getImageInput(container), {
      target: { files: [testImage()] },
    });

    const honeypot = container.querySelector(
      'input[name="company"]',
    ) as HTMLInputElement;
    fireEvent.change(honeypot, { target: { value: "I am a bot" } });

    fireEvent.click(submitButton());

    expect(await screen.findByText(en.form.successTitle)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
});
