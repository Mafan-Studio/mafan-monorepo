// TODO(before launch): confirm the real Instagram handle. Every Instagram
// link on the site (header, hero, DM card, feed, footer) is built from it.
export const INSTAGRAM_HANDLE = "mafan.studio";

export const INSTAGRAM_PROFILE_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

// Opens a direct-message thread with the account (app on mobile, web on
// desktop).
export const INSTAGRAM_DM_URL = `https://ig.me/m/${INSTAGRAM_HANDLE}`;

export const CONTACT_EMAIL = "info@mafan.studio";

export const SITE_URL = "https://www.mafan.studio";

// Details Dutch law requires on a business website (KvK number, trade
// name, address, email; BTW-id once selling). Fill these in from the KvK
// registration; a field left null is simply not shown.
export interface LegalDetails {
  tradeName: string;
  kvkNumber: string | null;
  btwId: string | null;
  // Leave null if the visiting address is shielded in the KvK register.
  address: string | null;
}

export const LEGAL: LegalDetails = {
  tradeName: "Mafan Studio",
  kvkNumber: "42116736",
  btwId: "NL005505510B23",
  address: "Jacques Bloemhof 135, 1628 VR Hoorn",
};
