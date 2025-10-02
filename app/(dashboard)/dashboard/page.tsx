import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Dashboard! 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            Hello, {user?.firstName || "Admin"}! You're successfully
            authenticated.
          </p>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 font-medium">
              ✅ Clerk Authentication is working perfectly!
            </p>
            <p className="text-blue-700 text-sm mt-2">
              Next up: We'll build the full dashboard UI with sidebar, software
              management, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
