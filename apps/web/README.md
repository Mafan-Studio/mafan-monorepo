# @mafan/web

The public Mafan Studio site (www.mafan.studio): a single landing page in
English, Dutch and Persian (`/en`, `/nl`, `/fa`), with the "send us your
drawing" inquiry form and a live Instagram feed.

## Running locally

```bash
cp .env.local.example .env.local   # then fill in the values
pnpm dev                           # http://localhost:3200
pnpm test                          # unit tests (Vitest)
pnpm test:e2e                      # browser tests (Playwright)
```

| Variable                              | Used for                                                                                            |
| ------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `SUPABASE_URL`, `SUPABASE_SECRET_KEY` | Storing inquiries and drawings, reading the Instagram token. Server-only.                           |
| `CRON_SECRET`                         | Protects the weekly Instagram token refresh (`/api/cron/refresh-instagram-token`). Production only. |

## How languages work

- Copy lives in `src/i18n/dictionaries/{en,nl,fa}.json`. English defines the
  shape: a key missing from `nl.json` or `fa.json` fails `tsc`.
- A visit to `/` is redirected (`src/proxy.ts`) to the language chosen by:
  saved choice (the `NEXT_LOCALE` cookie, set by the language switcher) →
  browser language → Dutch for visitors in the Netherlands → English.
  URLs that already include a language are never redirected.
- Persian pages are right-to-left. Use logical CSS properties
  (`padding-inline`, `margin-inline-start`, `inset-inline-end`, …) instead of
  `left`/`right` in styles so layouts mirror correctly.

## Showcase pairs

The drawing → keepsake pairs are listed in `src/content/showcase.ts`, with
images in `public/showcase/`. They are placeholders until the real photos
arrive. To replace one, add the photos to `public/showcase/`, update the
paths in `showcase.ts`, and check its caption and alt text in all three
dictionaries under `showcase.items.<slug>`.

## Connecting Instagram (one-time)

The site works without this step: until a token is stored, the Instagram
section shows only a "follow us" link. Once a token is stored, posts appear
within about an hour, with no redeploy.

1. **Make the Instagram account a Professional account.** In the Instagram
   app: Settings → Account type and tools → Switch to professional account
   (Creator or Business). This is free and keeps all posts.
2. **Create a Meta app.** At [developers.facebook.com](https://developers.facebook.com/apps)
   → Create app → choose the Business type → add the **Instagram** product
   and pick **API setup with Instagram login**.
3. **Connect the account.** In the Instagram product's setup page, add the
   Mafan Studio Instagram account and generate an access token for it with
   the `instagram_business_basic` permission. The token generated there is
   long-lived (valid for 60 days).
4. **Store the token.** In Supabase Studio → SQL Editor, run:

   ```sql
   insert into public.instagram_credentials (id, access_token, expires_at)
   values (1, '<the token>', now() + interval '60 days')
   on conflict (id) do update
     set access_token = excluded.access_token,
         expires_at = excluded.expires_at,
         refreshed_at = now();
   ```

5. **Keep it alive automatically.** In Vercel → Project → Settings →
   Environment Variables, add `CRON_SECRET` (any long random string,
   Production) and redeploy once. Vercel then calls the refresh endpoint
   every Monday (`vercel.json`), well before the 60 days run out.

To check it works: the feed shows posts within an hour, and calling the
refresh endpoint manually updates `expires_at` in the table:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://www.mafan.studio/api/cron/refresh-instagram-token
```

If the token ever expires (for example, every refresh failed for two months),
repeat steps 3–4. Failures are logged in Vercel's function logs.
