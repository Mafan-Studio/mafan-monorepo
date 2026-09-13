import { render, screen, fireEvent } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { InquiryForm } from "./InquiryForm";

const renderForm = () =>
  render(
    <MantineProvider>
      <InquiryForm />
    </MantineProvider>,
  );

// Mantine renders required-field labels as e.g. "Your name *" (the asterisk
// is a visually-hidden child span), so exact text matching fails here even
// though it doesn't in a real browser (which excludes aria-hidden content
// from the accessible name). Partial matching sidesteps that.
const getRequiredField = (label: string) =>
  screen.getByLabelText(label, { exact: false });

const testImage = () =>
  new File(["fake image content"], "drawing.png", { type: "image/png" });

// Mantine's FileInput associates the label with the visible trigger
// button, not the hidden native <input type="file">, so getByLabelText
// can't find it — query the real input directly.
const getImageInput = (container: HTMLElement) =>
  container.querySelector('input[type="file"]') as HTMLInputElement;

describe("InquiryForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true } as Response));
  });

  it("blocks submission and shows validation errors when required fields are invalid", async () => {
    renderForm();

    fireEvent.change(getRequiredField("Email"), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      await screen.findByText("Please enter your name"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Please enter a valid email"),
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("requires a photo even when name and email are valid", async () => {
    renderForm();

    fireEvent.change(getRequiredField("Your name"), {
      target: { value: "Test Parent" },
    });
    fireEvent.change(getRequiredField("Email"), {
      target: { value: "parent@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      await screen.findByText("Please upload a photo of the drawing"),
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("submits valid data with the image and shows the success message", async () => {
    const { container } = renderForm();

    fireEvent.change(getRequiredField("Your name"), {
      target: { value: "Test Parent" },
    });
    fireEvent.change(getRequiredField("Email"), {
      target: { value: "parent@example.com" },
    });
    fireEvent.change(getImageInput(container), {
      target: { files: [testImage()] },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      await screen.findByText("We've received your drawing!"),
    ).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, options] = vi.mocked(fetch).mock.calls[0]!;
    expect(url).toBe("/api/inquiries");
    expect(options?.method).toBe("POST");

    const body = options?.body as FormData;
    expect(body.get("name")).toBe("Test Parent");
    expect(body.get("email")).toBe("parent@example.com");
    expect((body.get("image") as File).name).toBe("drawing.png");
  });

  it("pretends to succeed without submitting when the honeypot field is filled", async () => {
    const { container } = renderForm();

    fireEvent.change(getRequiredField("Your name"), {
      target: { value: "Test Parent" },
    });
    fireEvent.change(getRequiredField("Email"), {
      target: { value: "parent@example.com" },
    });
    fireEvent.change(getImageInput(container), {
      target: { files: [testImage()] },
    });

    const honeypot = container.querySelector(
      'input[name="company"]',
    ) as HTMLInputElement;
    fireEvent.change(honeypot, { target: { value: "I am a bot" } });

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      await screen.findByText("We've received your drawing!"),
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
});
