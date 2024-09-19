import { Button } from "@/components/ui/button"; // Import your Button component
import { useRef } from "react";

interface ImageUploadProps {
  onFileChange: (file: File | null) => void;
}

export const ImageUpload = ({ onFileChange }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFileChange(event.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={handleButtonClick} className="w-full">
        Choose Image
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden" // Hide the file input
      />
    </div>
  );
};
