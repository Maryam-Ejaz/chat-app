"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/backend/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/lib/store/user";
import { Imessage, useMessage } from "@/lib/store/messages";
import { Textarea } from "@/components/ui/textarea";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SmileIcon } from "lucide-react";
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const ChatInput = () => {
  const user = useUser((state) => state.user);
  const addMessage = useMessage((state) => state.addMessage);
  const setOptimisticIds = useMessage((state) => state.setOptimisticIds);
  const supabase = supabaseClient();

  const [text, setText] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const handleSendMessage = async (text: string) => {
    const user = useUser.getState().user;
    if (text.trim()) {
      const id = uuidv4();
      const newMessage = {
        id,
        text,
        sent_by: user?.id,
        is_edit: false,
        created_at: new Date().toISOString(),
        users: {
          id: user?.id,
          avatar_url: user?.user_metadata.avatar_url,
          created_at: new Date().toISOString(),
          display_name: user?.user_metadata.user_name,
          email: user?.email,
        },
      };
      addMessage(newMessage as Imessage);
      setOptimisticIds(newMessage.id);
      const { error } = await supabase.from("messages").insert({ text, id });
      if (error) {
        toast.error("Sorry, this message couldn't be delivered.");
      }
    } else {
      toast.error("Message cannot be empty!!");
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: any) => {
    setText(text + emoji.native);
    setShowEmojiPicker(false); // Hide emoji picker after selection
  };

  return (
    <div className="px-9 pb-5">
      <div className="w-full">
        <div className="relative flex items-center">
          <div className="flex-1 relative px-1">
            <Textarea
              className={`resize-none w-full border-b-2 border-[var(--foreground-color)]`}
              placeholder="Send Message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && text.trim()) {
                  handleSendMessage(text);
                  setText("");
                }
              }}
            />
            {/* Icon Picker */}
            <button
              className="absolute right-2 bottom-1 text-gray-500 hover:text-[var(--foreground-color)]"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <SmileIcon className="h-5 w-5 mb-1" />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-2 z-10">
                <Picker data={data} onEmojiSelect={handleEmojiSelect} />
              </div>
            )}
          </div>
          <div className="ml-4 mt-2 flex items-center">
            <button
              className={`text-[var(--foreground-color)] ${!text.trim() ? " cursor-not-allowed" : ""}`}
              onClick={() => {
                if (text.trim()) {
                  handleSendMessage(text);
                  setText("");
                }
              }}
              disabled={!text.trim()}
            >
              <FontAwesomeIcon icon={faPaperPlane} className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
