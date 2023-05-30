import "@/styles/globals.css";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <div className={`${inter.className}`}>
      <SessionProvider session={session}>
        <MantineProvider withNormalizeCSS theme={{ colorScheme: "dark" }}>
          <QueryClientProvider client={queryClient}>
            <div className={`min-h-screen ${inter.className}`}>
              <Component {...pageProps} />
            </div>
          </QueryClientProvider>
        </MantineProvider>
      </SessionProvider>
    </div>
  );
};

export default MyApp;
