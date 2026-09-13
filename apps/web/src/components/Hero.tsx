"use client";

import { Button, Container, Group, Stack, Text, Title } from "@mantine/core";
import styled from "@emotion/styled";
import { colors, spacing } from "@mafan/tokens";

const HeroSection = styled.div`
  background: ${colors.neutral.warmWhite};
  padding: ${spacing.xxl} 0;
`;

export const Hero = () => {
  return (
    <HeroSection>
      <Container size="sm">
        <Stack align="center" gap="md">
          <Title order={1} ta="center" c={colors.neutral.ink}>
            Kids draw it. We bring it to life.
          </Title>
          <Text ta="center" c={colors.neutral.secondaryInk} size="lg">
            Mafan Studio turns a child&apos;s drawing into a custom 3D keepsake
            &mdash; and prints ready-made pieces for the home.
          </Text>
          <Group mt="md">
            <Button component="a" href="#inquiry" color="pink" size="md">
              Turn a Drawing into 3D
            </Button>
          </Group>
        </Stack>
      </Container>
    </HeroSection>
  );
};
