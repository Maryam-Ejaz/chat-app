"use client"
import { User } from "@supabase/supabase-js";
import React, { useEffect, useRef } from "react";
import { useUser } from "./user";
import { supabaseClient } from "@/lib/backend/client";  

export default function InitUser({ user }: { user: User | undefined }) {
  const initState = useRef(false);
  const supabase = supabaseClient();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      // Fetch user details from Supabase
      const { data, error } = await supabase
        .from('users')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error fetching user data:", error.message);
      } else if (data) {
        const userMetaData = {
          user_metadata: {
            display_name: data.display_name,
            avatar_url: data.avatar_url,
          },
        };

        // Update the Zustand store with the fetched user details
        useUser.setState({
          user: {
            ...user,
            ...userMetaData.user_metadata, // Spread the user_metadata
          },
        });
      }
    };

    if (!initState.current) {
      fetchUserData();  // Fetch user data on initial render
      initState.current = true; // Set initState to true after fetching
    }
    // eslint-disable-next-line
  }, [user]);

  return null; // Return null instead of an empty fragment
}
