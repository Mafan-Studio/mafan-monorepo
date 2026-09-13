import { useEffect, useState } from "react";
import {
  Alert,
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
  name: string;
  email: string;
  child_name: string | null;
  message: string | null;
  image_path: string | null;
  created_at: string;
}

interface InquiriesDashboardProps {
  onLogout: () => void;
}

const SIGNED_URL_TTL_SECONDS = 10 * 60;

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
        .select("id, name, email, child_name, message, image_path, created_at")
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
                  alt={`Drawing from ${inquiry.name}`}
                  w={120}
                  h={120}
                  fit="cover"
                  radius="sm"
                />
              )}
              <Stack gap={4} style={{ flex: 1 }}>
                <Text fw={600}>{inquiry.name}</Text>
                <Text size="sm" c="dimmed">
                  {inquiry.email}
                </Text>
                {inquiry.child_name && (
                  <Text size="sm">Child: {inquiry.child_name}</Text>
                )}
                {inquiry.message && <Text size="sm">{inquiry.message}</Text>}
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
