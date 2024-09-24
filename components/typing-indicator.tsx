import { supabaseClient } from "@/lib/backend/client";
import { useEffect, useRef } from "react";
import { useUser } from "@/lib/store/user";
import { useMessage } from "@/lib/store/messages";

const TYPING_EVENT = "typing";

export const useTypingIndicator = (
  isTyping: boolean,


) => {
  const user = useUser((state) => state.user);
  const supabase = supabaseClient();



  useEffect(() => {
    const sendTypingIndicator = (isTypingValue: boolean) => {
      console.log("BROADCASTING");
      supabase.channel("type").send({
        type: "broadcast",
        event: TYPING_EVENT,
        payload: {
          userId: user?.id,
          displayName: user?.user_metadata.user_metadata.display_name,
          avatarUrl: user?.user_metadata.user_metadata.avatar_url,
          isTyping: isTypingValue,
        },
      });


    };


    sendTypingIndicator(isTyping);

  }, [isTyping, user]);
};
