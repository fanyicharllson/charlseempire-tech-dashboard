import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LoadingScreen from "./components/ui/loading-screen";

export default async function Home() {
  const { userId } = await auth();

  // Redirect based on auth status
  if (userId) {
    redirect("/dashboard");
  } else {
    redirect("/sign-in");
  }

  // This won't render because of redirects above, but Next.js requires a return
  return <LoadingScreen message="Redirecting..." />;
}
