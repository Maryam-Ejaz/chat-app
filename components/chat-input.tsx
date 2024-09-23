"use client";
import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "@/lib/backend/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/lib/store/user";
import { Imessage, useMessage } from "@/lib/store/messages";
import { Textarea } from "@/components/ui/textarea";
import { SmileIcon } from "lucide-react";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import SendIcon from "@/components/svgs/send-icon";
import { useTheme } from "next-themes";
import { useTypingIndicator } from "./typing-indicator";

const ChatInput = () => {
  const user = useUser((state) => state.user);
  const addMessage = useMessage((state) => state.addMessage);
  const setOptimisticIds = useMessage((state) => state.setOptimisticIds);
  const supabase = supabaseClient();
  const [text, setText] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const [emojiStyle, setEmojiStyle] = useState<EmojiStyle>(EmojiStyle.NATIVE);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const optimisticDeleteMessage = useMessage((state) => state.optimisticDeleteMessage);

  // Store messages in state 
  const [messages, setMessages] = useState<any[]>([]);

  const addTypingMessage = (message: any) => {
    setOptimisticIds(message.id);
    addMessage(message);
    setMessages((prev) => {
      // Prevent duplicates
      if (prev.find((m) => m.id === message.id)) return prev;
      return [...prev, message];
    });
  };

  const removeTypingMessage = (id: any) => {
    setMessages((prev) => {
      const updatedMessages = prev.filter((m) => m.id !== `${id}-typing`);
      console.log(id, updatedMessages); // Log the ID and the updated messages
      optimisticDeleteMessage(`${id}-typing`);
      return updatedMessages;
    });
  };



  useTypingIndicator(isTyping, addTypingMessage, removeTypingMessage);


  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
    setIsTyping(false);
  };

  useEffect(() => {
    const updateEmojiStyle = () => {
      setEmojiStyle(window.innerWidth < 1000 ? EmojiStyle.NATIVE : EmojiStyle.GOOGLE);
    };

    updateEmojiStyle();
    window.addEventListener("resize", updateEmojiStyle);

    return () => {
      window.removeEventListener("resize", updateEmojiStyle);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const resetTypingTimeout = () => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const newTimeout = setTimeout(() => {
      setIsTyping(false); // Set typing to false after 1.5 second
    }, 5000);
    setTypingTimeout(newTimeout);
  };

  const handleSendMessage = async (text: string) => {
    setIsTyping(false);
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
          avatar_url: user?.user_metadata.user_metadata.avatar_url,
          created_at: new Date().toISOString(),
          display_name: user?.user_metadata.user_metadata.display_name,
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

  const handleEmojiClick = (emojiObject: any) => {
    setText((prev) => prev + emojiObject.emoji);
    textareaRef.current?.focus();
  };

  return (
    <div className="px-9 pb-5 z-index-50">
      <div className="w-full">
        <div className="relative flex items-center">
          <div className="flex-1 relative px-1">
            <Textarea
              ref={textareaRef}
              className={`resize-none w-full border-b-2 border-[var(--foreground-color)] opacity-50 hover:opacity-100 focus:opacity-100`}
              placeholder="Message"
              value={text}
              onKeyDownCapture={handleFocus}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={(e) => {
                setText(e.target.value);
                setIsTyping(true);
                resetTypingTimeout(); // Reset timeout on typing
              }}
              onKeyDown={(e) => {
                resetTypingTimeout(); // Reset on key down
                if (e.key === "Enter") {
                  if (text.trim()) {
                    handleSendMessage(text);
                    setText("");
                  }
                  e.preventDefault();
                }
              }}
            />

            <button
              className="absolute right-2 bottom-1 text-[var(--foreground-color)] opacity-50 hover:opacity-100 transition-opacity duration-300"
              onClick={() => {
                setShowEmojiPicker((prev) => !prev);
                textareaRef.current?.focus();
              }}
            >
              <SmileIcon className="h-5 w-5 mb-1" />
            </button>

            {showEmojiPicker && (
              <div ref={emojiPickerRef} className="absolute bottom-12 right-[-33px] z-10 backdrop-blur-lg">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  emojiStyle={emojiStyle}
                  autoFocusSearch={false}
                  theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
                  style={{
                    backgroundColor: "var(--background-color)",
                    backdropFilter: "blur(50.6px)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                />
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

