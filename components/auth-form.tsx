"use client"
import { useState } from "react";
import { AnonymousLoginForm } from "@/components/anonymous-login-form";

const AuthForm = () => {
  const [loggingAnonymously, setLoggingAnonymously] = useState(false);

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Login 🔐
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex flex-col gap-6">
          <AnonymousLoginForm
            logging={loggingAnonymously}
            setLogging={setLoggingAnonymously}
          />
        </div>
        <p className="mt-10 text-center">
          Go back to{" "}
          <a href="/" className="font-semibold leading-6 text-primary hover:text-popover-foreground">
            Home
          </a>{" "}
          🏠
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
