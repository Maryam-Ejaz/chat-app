import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { handleLoginWithOAuth } from "@/lib/backend/auth-service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub, faDiscord } from '@fortawesome/free-brands-svg-icons'; // FontAwesome brand icons

interface OAuthButtonProps {
  provider: "google" | "github" | "discord";
  logging: boolean;
  setLogging: (logging: boolean) => void;
}

export const OAuthButton = ({ provider, logging, setLogging }: OAuthButtonProps) => {
  const providerIcons = {
    google: faGoogle,
    github: faGithub,
    discord: faDiscord,
  };

  const handleLogin = async () => {
    setLogging(true);
    try {
      await handleLoginWithOAuth(provider);
    } catch (error) {
      console.error("OAuth login error:", error);
    } finally {
      setLogging(false);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      disabled={logging}
      className="flex items-center justify-center w-full"
    >
      {logging ? (
        <>
          Logging In
          <Loader2 className="h-4 w-4 ml-2 animate-spin" />
        </>
      ) : (
        <>
          <FontAwesomeIcon
            icon={providerIcons[provider]}
            className="mr-2 h-5 w-5"
          />
          {provider.charAt(0).toUpperCase() + provider.slice(1)}
        </>
      )}
    </Button>
  );
};
