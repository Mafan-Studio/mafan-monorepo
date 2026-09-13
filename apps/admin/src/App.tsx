import { Container, Stack, Text, Title } from "@mantine/core";

export const App = () => {
  return (
    <Container size="xs" py="xl">
      <Stack align="center" gap="xs">
        <Title order={1}>Mafan Admin</Title>
        <Text c="dimmed" ta="center">
          Nothing to manage yet — the admin panel starts filling in from Phase 2
          (project review, quotes, production board).
        </Text>
      </Stack>
    </Container>
  );
};
