import { useEffect, useState } from "react";
import {
  Alert,
  Anchor,
  Badge,
  Button,
  Card,
  Container,
  Group,
  Image,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { supabase } from "../lib/supabaseClient";

interface InquiryRow {
  id: string;
  name: string | null;
  email: string | null;
  instagram_handle: string | null;
  locale: string;
  child_name: string | null;
  message: string | null;
  image_path: string | null;
  created_at: string;
}

interface InquiriesDashboardProps {
  onLogout: () => void;
}

const SIGNED_URL_TTL_SECONDS = 10 * 60;

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  nl: "Dutch",
  fa: "Persian",
};

export const InquiriesDashboard = ({ onLogout }: InquiriesDashboardProps) => {
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("inquiries")
        .select(
          "id, name, email, instagram_handle, locale, child_name, message, image_path, created_at",
        )
        .order("created_at", { ascending: false });

      if (cancelled) {
        return;
      }

      if (fetchError) {
        setError("Failed to load inquiries");
        setLoading(false);
        return;
      }

      const rows = data ?? [];
      setInquiries(rows);

      const paths = rows
        .map((row) => row.image_path)
        .filter((path): path is string => Boolean(path));

      if (paths.length > 0) {
        const { data: signedUrls } = await supabase.storage
          .from("inquiry-drawings")
          .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);

        if (!cancelled && signedUrls) {
          const map: Record<string, string> = {};
          for (const entry of signedUrls) {
            if (entry.signedUrl && entry.path) {
              map[entry.path] = entry.signedUrl;
            }
          }
          setImageUrls(map);
        }
      }

      setLoading(false);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Container size="sm" py="xl">
      <Group justify="space-between" mb="md">
        <Title order={2}>Inquiries</Title>
        <Button variant="subtle" color="pink" onClick={onLogout}>
          Log out
        </Button>
      </Group>

      {loading && <Loader />}
      {error && (
        <Alert color="error" title="Something went wrong">
          {error}
        </Alert>
      )}
      {!loading && !error && inquiries.length === 0 && (
        <Text c="dimmed">No inquiries yet.</Text>
      )}

      <Stack gap="md">
        {inquiries.map((inquiry) => (
          <Card key={inquiry.id} withBorder radius="sm">
            <Group align="flex-start" wrap="nowrap">
              {inquiry.image_path && imageUrls[inquiry.image_path] && (
                <Image
                  src={imageUrls[inquiry.image_path]}
                  alt="Uploaded drawing"
                  w={120}
                  h={120}
                  fit="cover"
                  radius="sm"
                />
              )}
              <Stack gap={4} style={{ flex: 1 }}>
                <Group gap="xs">
                  {inquiry.name && (
                    <Text fw={600} dir="auto">
                      {inquiry.name}
                    </Text>
                  )}
                  <Badge variant="light" color="pink" size="sm">
                    {LANGUAGE_NAMES[inquiry.locale] ?? inquiry.locale}
                  </Badge>
                </Group>
                {inquiry.email && (
                  <Anchor size="sm" href={`mailto:${inquiry.email}`}>
                    {inquiry.email}
                  </Anchor>
                )}
                {inquiry.instagram_handle && (
                  <Anchor
                    size="sm"
                    href={`https://www.instagram.com/${inquiry.instagram_handle}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @{inquiry.instagram_handle}
                  </Anchor>
                )}
                {inquiry.child_name && (
                  <Text size="sm" dir="auto">
                    Name for the statue: {inquiry.child_name}
                  </Text>
                )}
                {/* Messages can be Persian; let the browser pick direction. */}
                {inquiry.message && (
                  <Text size="sm" dir="auto">
                    {inquiry.message}
                  </Text>
                )}
                <Text size="xs" c="dimmed">
                  {new Date(inquiry.created_at).toLocaleString()}
                </Text>
              </Stack>
            </Group>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};
