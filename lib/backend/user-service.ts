import { supabaseClient } from "@/lib/backend/client";

export const createOrUpdateUser = async (userId: string, name: string, avatarUrl: string, assignedColor: string) => {
  const supabase = supabaseClient();

  // Update user metadata
  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      user_metadata: {
        display_name: name,
        avatar_url: avatarUrl,
      },
    },
  });

  if (metadataError) {
    console.error("Error updating user metadata:", metadataError.message);
    throw metadataError;
  }

  const { data, error: dbError } = await supabase.from("users").insert({
    display_name: name,
    avatar_url: avatarUrl,
    email: "anonymous@example.com", 
    colour: assignedColor,
  });

  if (dbError) {
    console.error("Error saving user to database:", dbError.message);
    throw dbError;
  }

  return data;
};
