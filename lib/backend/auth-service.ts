import { supabaseClient } from "@/lib/backend/client";
import { handleImageUpload } from "@/lib/backend/storage-service";
import { createOrUpdateUser } from "@/lib/backend/user-service";

export const handleAnonymousLogin = async (name: string, imageFile: File | null) => {
  const supabase = supabaseClient();
  
  // Set default values if name or imageFile is not provided
  const defaultName = "user";
  const defaultImageUrl = "https://qtumgzsrnbhtigfxhfzt.supabase.co/storage/v1/object/sign/images/echo-logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvZWNoby1sb2dvLnBuZyIsImlhdCI6MTcyNjc1OTE0MCwiZXhwIjoxNzU4Mjk1MTQwfQ.vnOhcqri5lrbczvNPjbwTSVbtWbePnbNA5XN6qIpWXw&t=2024-09-19T15%3A18%3A15.652Z"; // Public URL for default image

  let imageUrl: string = defaultImageUrl;

  // Use default name if no name is provided
  const userName = name.trim() === "" ? defaultName : name;

  try {
    // Perform anonymous sign-in
    const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();
    if (signInError) {
      console.error("Error logging in anonymously:", signInError.message);
      return;
    }

    const userId = signInData?.user?.id; // Get the anonymous user's UID

    if (!userId) {
      console.error("Failed to retrieve user ID.");
      return;
    }

    // If imageFile is provided, try uploading it using the UID as the file name
    if (imageFile) {
      const fileName = `${userId}.png`; // Use UID as file name
      try {
        imageUrl = await handleImageUpload(fileName, imageFile) || defaultImageUrl;
      } catch (error) {
        console.error("Image upload failed:", error);
        // Default image URL will be used in case of upload failure
      }
    }

    try {
      // Create or update user in the 'user' table
      await createOrUpdateUser(userId, userName, imageUrl);

      // Update user metadata in Supabase
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          user_metadata: {
            display_name: userName,
            avatar_url: imageUrl,
          },
        },
      });

      if (metadataError) {
        console.error("Error updating user metadata:", metadataError.message);
      }

      console.log("Anonymous login successful, metadata and user saved.");
      // Redirect to home page after successful login
      window.location.href = "/";
    } catch (error) {
      console.error("Error saving user data:", error);
    }

  } catch (error) {
    console.error("Error logging in anonymously:", error);
  }
};




export const handleLoginWithOAuth = async (provider: "google" | "github" | "discord") => {
  const supabase = supabaseClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Error initiating OAuth login:", error.message);
    throw error;
  }
};
