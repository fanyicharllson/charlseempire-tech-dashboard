import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Get Started 🚀
        </h2>
        <p className="text-gray-600 text-sm">
          Create your account and start managing software
        </p>
      </div>

      <SignUp />
    </div>
  );
}
