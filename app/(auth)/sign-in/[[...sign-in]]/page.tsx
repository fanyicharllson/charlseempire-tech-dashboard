import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome Back! 👋
        </h2>
        <p className="text-gray-600 text-sm">
          Sign in to manage your software catalog
        </p>
      </div>

      <SignIn />
    </div>
  );
}
