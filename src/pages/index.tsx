import { Inter } from "next/font/google";
import { useSession, signIn, signOut } from "next-auth/react";
import LandingPage from "@/components/LandingPage";
import DashBoard from "@/components/DashBoard";

const inter = Inter({ subsets: ["latin"] });
export default function Home() {
  const { data: session } = useSession();
  if (session) return <DashBoard />;
  return <LandingPage />;
}
