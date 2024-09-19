import { supabaseClient } from "@/lib/backend/client";
export const handleImageUpload = async (fileName: string,imageFile: File) => {
  const supabase = supabaseClient();

  // Upload the file to the 'images' bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("images")
    .upload(`${fileName}`, imageFile); // Save file with the user's UID as the filename

  if (uploadError) {
    console.error("Error uploading image:", uploadError.message);
    throw uploadError;
  }

  // Retrieve the public URL of the uploaded file
  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(fileName);

  // Return the public URL of the uploaded file
  return publicUrlData?.publicUrl;
};

