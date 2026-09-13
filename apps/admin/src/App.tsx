import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Center, Loader } from "@mantine/core";
import { supabase } from "./lib/supabaseClient";
import { Login } from "./components/Login";
import { InquiriesDashboard } from "./components/InquiriesDashboard";

export const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setInitializing(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (initializing) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  if (!session) {
    return <Login />;
  }

  return <InquiriesDashboard onLogout={() => supabase.auth.signOut()} />;
};
