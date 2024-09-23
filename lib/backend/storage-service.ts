import { supabaseClient } from "@/lib/backend/client";

export const handleImageUpload = async (fileName: string, imageFile: File): Promise<string | null> => {
  const supabase = supabaseClient();

  // Upload the file to the 'images' bucket
  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(fileName, imageFile);

  if (uploadError) {
    console.error("Error uploading image:", uploadError.message);
    throw uploadError;
  }

  // Generate the file path for the uploaded image
  const filePath = `${fileName}`;
  const expiresIn = 9000000; // URL expiration time in seconds

  // Create a signed URL for the uploaded image
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("images")
    .createSignedUrl(filePath, expiresIn);

  if (signedUrlError) {
    console.error("Error generating signed URL:", signedUrlError.message);
    throw signedUrlError;
  }

  // Return the signed URL
  return signedUrlData?.signedUrl;
};

