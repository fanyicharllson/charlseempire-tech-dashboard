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

      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-transparent shadow-none p-0",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton:
              "bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-gray-700 font-medium",
            socialButtonsBlockButtonText: "font-medium",
            dividerLine: "bg-gray-200",
            dividerText: "text-gray-500 text-sm",
            formButtonPrimary:
              "bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg",
            formFieldInput:
              "border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-4 py-3 transition-all duration-200",
            formFieldLabel: "text-gray-700 font-medium mb-2",
            footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
            identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
            formFieldInputShowPasswordButton:
              "text-gray-500 hover:text-gray-700",
            otpCodeFieldInput:
              "border-2 border-gray-200 focus:border-blue-500 rounded-lg",
          },
        }}
      />
    </div>
  );
}
