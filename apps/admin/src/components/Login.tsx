import { useState } from "react";
import {
  Alert,
  Button,
  Container,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, isEmail, isNotEmpty } from "@mantine/form";
import { supabase } from "../lib/supabaseClient";

interface LoginValues {
  email: string;
  password: string;
}

export const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginValues>({
    initialValues: { email: "", password: "" },
    validate: {
      email: isEmail("Please enter a valid email"),
      password: isNotEmpty("Please enter your password"),
    },
  });

  const handleSubmit = async (values: LoginValues) => {
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    setLoading(false);

    if (signInError) {
      setError("Incorrect email or password");
    }
  };

  return (
    <Container size="xs" py="xl">
      <Paper withBorder p="lg" radius="sm">
        <Stack gap="sm">
          <Title order={2} ta="center">
            Mafan Admin
          </Title>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="sm">
              <TextInput
                label="Email"
                type="email"
                required
                key={form.key("email")}
                {...form.getInputProps("email")}
              />
              <PasswordInput
                label="Password"
                required
                key={form.key("password")}
                {...form.getInputProps("password")}
              />
              {error && (
                <Alert color="error" title="Sign in failed">
                  {error}
                </Alert>
              )}
              <Button type="submit" color="pink" loading={loading}>
                Log in
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
};
