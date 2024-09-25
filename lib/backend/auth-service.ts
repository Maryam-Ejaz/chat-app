import { DEFAULT_AVATAR } from "@/constants";
import { supabaseClient } from "@/lib/backend/client";
import { handleImageUpload } from "@/lib/backend/storage-service";
import { createOrUpdateUser } from "@/lib/backend/user-service";
import { useUser } from "../store/user";
import { use } from "react";
import { getAssignedColor } from "../getColor";


export const handleAnonymousLogin = async (name: string, imageFile: File | null) => {
  const supabase = supabaseClient();

  // Set default values if name or imageFile is not provided
  const defaultName = "user";
  const defaultImageUrl = DEFAULT_AVATAR;

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

    const userId = signInData?.user?.id;

    if (!userId) {
      console.error("Failed to retrieve user ID.");
      return;
    }

    // If imageFile is provided, try uploading it using the UID as the file name
    if (imageFile) {
      const fileName = `${userId}.png`;
      try {
        imageUrl = await handleImageUpload(fileName, imageFile) || defaultImageUrl;
        console.log(imageUrl);
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }

    try {
        // Assign a color to the user using the utility function
        const assignedColor = getAssignedColor(userId);

      // Create or update user in the 'user' table
      await createOrUpdateUser(userId, userName, imageUrl, assignedColor);

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


