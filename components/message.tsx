import { Imessage, useMessage } from "@/lib/store/messages";
import React from "react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useUser } from "@/lib/store/user";

const Message = ({ message }: { message: Imessage }) => {
  const user = useUser((state) => state.user);
  const displayName = message.users?.display_name || "Me";
  const avatarUrl = message.users?.avatar_url || "/echo-logo.png"; 
  const createdAt = new Date(message.created_at);
  const formattedTime = createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const formattedDate = createdAt.toLocaleDateString();

  const isCurrentUser = message.users?.id === user?.id;

  return (
    <div className={`flex ${isCurrentUser ? 'flex-row-reverse ml-4' : 'mr-4'} gap-2`}>
      <div>
        <Image
          src={avatarUrl}
          alt={displayName}
          width={45}
          height={45}
          className={`rounded-lg shadow-xl ${isCurrentUser ? 'ml-4' : 'mr-4'}`}
        />
      </div>
      
      <div className={`flex-1 overflow-x-hidden ${isCurrentUser ? 'text-right' : ''}`}>
        <div className="flex items-start justify-between gap-1">
          <div className={`flex flex-col gap-0 w-[100%] ${isCurrentUser ? 'items-end' : ''}`}>
            <div className={`flex items-center gap-2 ${isCurrentUser ? 'justify-end flex-row-reverse' : ''}`}>
              <h1 className="text-xs font-light text-gray-400">{displayName}</h1>
              <h1 className="text-xs font-light text-gray-400">
                {formattedDate} <span className="mx-1"> </span>{formattedTime}
              </h1>
              {message.is_edit && (
                <h1 className="text-xs font-light text-gray-400">edited</h1>
              )}
            </div>
            <p className={`break-words font-medium rounded-bl-3xl w-fit ${isCurrentUser ? 'text-right' : ''}`}>
              {message.text}
            </p>
          </div>
          {/* {isCurrentUser && <MessageMenu message={message} />} */}
        </div>
      </div>
    </div>
  );
};

const MessageMenu = ({ message }: { message: Imessage }) => {
  const setActionMessage = useMessage((state) => state.setActionMessage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Action</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-edit")?.click();
            setActionMessage(message);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-delete")?.click();
            setActionMessage(message);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Message;
