"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/backend/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/lib/store/user";
import { Imessage, useMessage } from "@/lib/store/messages";
import { Textarea } from "@/components/ui/textarea";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const ChatInput = () => {
  const user = useUser((state) => state.user);
  const addMessage = useMessage((state) => state.addMessage);
  const setOptimisticIds = useMessage((state) => state.setOptimisticIds);
  const supabase = supabaseClient();

  const [text, setText] = useState<string>("");

  const handleSendMessage = async (text: string) => {
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

  return (
    <div className="px-9 pb-5 ">
      <div className="w-full">
        <div className="flex">
          <div className="flex-1">
            <Textarea
              className={`resize-none w-full border-b-2 ${text.trim() ? 'border-white' : 'border-gray-600'} focus:border-white`}
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
          </div>
          <div className="ml-2 mt-2 flex items-center">
            <button
              className={`text-white ${!text.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
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
