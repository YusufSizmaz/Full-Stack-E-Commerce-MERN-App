import React from "react";
import { useRouteError, useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="min-h-[78vh] flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Oops!</h1>
        <h2 className="text-xl font-semibold mb-2">
          Error {error?.status || 404}
        </h2>
        <p className="text-gray-600 mb-6">
          {error?.statusText || "Sayfa bulunamadı"}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Ana Sayfa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
