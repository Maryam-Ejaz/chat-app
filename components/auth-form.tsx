"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OAuthButton } from "@/components/ui/oauth-button";
import { AnonymousLoginForm } from "@/components/anonymous-login-form";

const AuthForm = () => {
  const [loggingWithGoogle, setLoggingWithGoogle] = useState(false);
  const [loggingWithGithub, setLoggingWithGithub] = useState(false);
  const [loggingWithDiscord, setLoggingWithDiscord] = useState(false);
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
          {/* <OAuthButton
            provider="google"
            logging={loggingWithGoogle}
            setLogging={setLoggingWithGoogle}
          />
          <OAuthButton
            provider="github"
            logging={loggingWithGithub}
            setLogging={setLoggingWithGithub}
          /> */}
          <OAuthButton
            provider="discord"
            logging={loggingWithDiscord}
            setLogging={setLoggingWithDiscord}
          />
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
