export default function LoadingScreen({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Logo */}
      <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6 shadow-xl animate-pulse">
        <svg
          className="w-10 h-10 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
          />
        </svg>
      </div>

      {/* Brand */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        CharlesEmpire Tech
      </h1>

      {/* Message */}
      <p className="text-blue-600 font-semibold italic flex items-center gap-2">
        {message}
        <span className="flex gap-1">
          <span
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></span>
          <span
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></span>
          <span
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></span>
        </span>
      </p>
    </div>
  );
}
