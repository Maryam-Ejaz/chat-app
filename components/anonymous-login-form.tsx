import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input"; 
import { ImageUpload } from "@/components/ui/image-upload";
import { handleAnonymousLogin } from "@/lib/backend/auth-service";

interface AnonymousLoginFormProps {
  logging: boolean;
  setLogging: (logging: boolean) => void;
}

export const AnonymousLoginForm = ({ logging, setLogging }: AnonymousLoginFormProps) => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleLogin = async () => {
    if (!name) {
      alert("Please provide your name.");
      return;
    }
    if (!imageFile) {
      alert("Please upload an image.");
      return;
    }
    setLogging(true);
    try {
      await handleAnonymousLogin(name, imageFile);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLogging(false);
    }
  };

  return (
    <div className="space-y-6"> 
      <TextInput
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        label=""
        placeholder="Name"
      />
      <div className="flex flex-col gap-4"> 
        <ImageUpload onFileChange={setImageFile} />
      </div>
      <Button onClick={handleLogin} disabled={logging} className="w-full">
        {logging ? "Logging In Anonymously" : "Login Anonymously"}
      </Button>
    </div>
  );
};
