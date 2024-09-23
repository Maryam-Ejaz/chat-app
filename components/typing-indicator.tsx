import { supabaseClient } from "@/lib/backend/client";
import { useEffect, useRef } from "react";
import { useUser } from "@/lib/store/user";
import { useMessage } from "@/lib/store/messages";

const TYPING_EVENT = "typing";

export const useTypingIndicator = (
  isTyping: boolean,
  addTypingMessage: (message: any) => void,
  removeTypingMessage: (userId: string) => void, // Accept userId

) => {
  const user = useUser((state) => state.user);
  const supabase = supabaseClient();
  const previousIsTypingRef = useRef(isTyping);
  const typingMessageId = `${user?.id}-typing`;

  useEffect(() => {
    const channel = supabase.channel("chatroom")
      .on("broadcast", { event: TYPING_EVENT }, (event) => {
        if (event.payload.userId !== user?.id) {
          if (event.payload.isTyping) {
            addTypingMessage({
              id: `${event.payload.userId}-typing`,
              text: `${event.payload.displayName} is typing...`,
              sent_by: event.payload.userId,
              users: {
                id: event.payload.userId,
                display_name: event.payload.displayName,
                avatar_url: event.payload.avatarUrl,
              },
            });
          } else {
            removeTypingMessage(event.payload.userId); // Pass userId to remove message
          }
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user, supabase, removeTypingMessage]);

  useEffect(() => {
    const sendTypingIndicator = (isTypingValue: boolean) => {
      supabase.channel("chatroom").send({
        type: "broadcast",
        event: TYPING_EVENT,
        payload: {
          userId: user?.id,
          displayName: user?.user_metadata.user_metadata.display_name,
          avatarUrl: user?.user_metadata.user_metadata.avatar_url,
          isTyping: isTypingValue,
        },
      });

      if (isTypingValue) {
        addTypingMessage({
          id: typingMessageId,
          text: "You are typing...",
          sent_by: user?.id,
          users: {
            id: user?.id,
            display_name: user?.user_metadata.user_metadata.display_name,
            avatar_url: user?.user_metadata.user_metadata.avatar_url,
          },
        });
      } else {
        removeTypingMessage(user?.id|| ""); // Pass local userId to remove local message
      }
    };

    // Only send typing indicator when `isTyping` changes
    if (isTyping !== previousIsTypingRef.current) {
      sendTypingIndicator(isTyping);
    }

    previousIsTypingRef.current = isTyping;
  }, [isTyping, user, addTypingMessage, removeTypingMessage]);
};
