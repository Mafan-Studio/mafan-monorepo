import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { describe, it, expect } from "vitest";
import en from "@/i18n/dictionaries/en.json";
import type { LegalDetails } from "@/content/site";
import { Footer } from "./Footer";

const renderFooter = (legal: LegalDetails) =>
  render(
    <MantineProvider>
      <Footer lang="en" legal={legal} strings={en.footer} />
    </MantineProvider>,
  );

describe("Footer", () => {
  it("shows the KvK number, BTW-id and address once they are filled in", () => {
    renderFooter({
      tradeName: "Mafan Studio",
      kvkNumber: "12345678",
      btwId: "NL000000000B01",
      address: "Grote Oost 1, 1621 AA Hoorn",
    });

    expect(
      screen.getByText(
        "Grote Oost 1, 1621 AA Hoorn · KvK 12345678 · BTW-id NL000000000B01",
      ),
    ).toBeInTheDocument();
  });

  it("leaves out details that are not filled in yet", () => {
    renderFooter({
      tradeName: "Mafan Studio",
      kvkNumber: null,
      btwId: null,
      address: null,
    });

    expect(screen.queryByText(/KvK/)).not.toBeInTheDocument();
    expect(screen.queryByText(/BTW-id/)).not.toBeInTheDocument();
  });

  it("links to the privacy statement in the current language", () => {
    renderFooter({
      tradeName: "Mafan Studio",
      kvkNumber: null,
      btwId: null,
      address: null,
    });

    expect(
      screen.getByRole("link", { name: en.footer.privacyLink }),
    ).toHaveAttribute("href", "/en/privacy");
  });
});
