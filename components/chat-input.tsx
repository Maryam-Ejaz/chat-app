"use client";

import { useState, useRef } from "react";
import { supabaseClient } from "@/lib/backend/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/lib/store/user";
import { Imessage, useMessage } from "@/lib/store/messages";
import { Textarea } from "@/components/ui/textarea";
import { SmileIcon } from "lucide-react";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import SendIcon from "@/components/svgs/send-icon";
import { useTheme } from "next-themes";

const ChatInput = () => {
  const user = useUser((state) => state.user);
  const addMessage = useMessage((state) => state.addMessage);
  const setOptimisticIds = useMessage((state) => state.setOptimisticIds);
  const supabase = supabaseClient();

  const [text, setText] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { theme } = useTheme();

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
  };

  // Handle clicks outside the picker
  const handleClickOutside = () => {
    setShowEmojiPicker(false);
  };

  // Check if the user is on a mobile device
  const isMobile = /Mobi|Android/i.test(window.navigator.userAgent);

  return (
    <div className="px-9 pb-5">
      <div className="w-full">
        <div className="relative flex items-center">
          <div className="flex-1 relative px-1">
            <Textarea
              ref={textareaRef}
              className={`resize-none w-full border-b-2 border-[var(--foreground-color)] opacity-50 hover:opacity-100 focus:opacity-100`}
              placeholder="Message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (text.trim()) {
                    handleSendMessage(text);
                    setText("");
                  }
                  e.preventDefault(); // Prevent the default behavior (moving to next line)
                }
              }}
            />

            {/* Icon Picker */}
            <button
              className="absolute right-2 bottom-1 text-[var(--foreground-color)] opacity-50 hover:opacity-100 transition-opacity duration-300"
              onClick={() => {
                if (isMobile) {
                  textareaRef.current?.focus(); 
                } else {
                  setShowEmojiPicker(!showEmojiPicker); 
                  textareaRef.current?.focus(); 
                }
              }}
            >
              <SmileIcon className="h-5 w-5 mb-1 " />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-12 right-0 z-10 backdrop-blur-lg">
                <Picker data={data} onEmojiSelect={handleEmojiSelect} className={"backdrop-blur-lg"}
                  onClickOutside={handleClickOutside}
                  autoFocus="true"
                  theme={theme}
                  style={{
                    backgroundColor: "transparent",
                    backdropFilter: "blur(10.6px)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  }} />
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
              <SendIcon
                className="opacity-50 hover:opacity-100 transition-opacity duration-300"
                width={20}
                height={20}
                color="var(--foreground-color)"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
