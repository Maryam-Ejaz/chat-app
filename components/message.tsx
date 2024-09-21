"use strict"
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
import { Edit2, MoreVertical } from "lucide-react";
import { useUser } from "@/lib/store/user";
import { DEFAULT_AVATAR } from "@/constants";

const Message = ({ message }: { message: Imessage }) => {
  const user = useUser((state) => state.user);
  const displayName = message.users?.display_name || "Me";
  const avatarUrl = message.users?.avatar_url || DEFAULT_AVATAR;
  const createdAt = new Date(message.created_at);
  const formattedTime = createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const formattedDate = createdAt.toLocaleDateString('en-GB');
  const isCurrentUser = message.users?.id === user?.id;

  return (
    <div className={`flex ${isCurrentUser ? 'flex-row-reverse mr-[-12px]' : 'mr-4'} gap-2`}>
      <div className={`flex ${isCurrentUser ? 'flex-row-reverse ' : ''}`}>
        {isCurrentUser && <MessageMenu message={message} />}
        <div>
          <Image
            src={avatarUrl}
            alt={displayName}
            width={45}
            height={45}
            className={`rounded-lg shadow-xl ${isCurrentUser ? 'ml-4' : 'mr-4'}`}
            style={{ objectFit: 'cover', height: '45px' }}
            unoptimized
          />
        </div>
      </div>

      <div className={`flex-1 overflow-x-hidden ${isCurrentUser ? 'text-right' : ''}`}>
        <div className="flex items-start justify-between gap-1">
          <div className={`flex flex-col gap-0 w-[100%] ${isCurrentUser ? 'items-end' : ''}`} style={{ letterSpacing: '0.1em' }}>
            <div className={`flex items-center text-[var(--message-detail-color)] gap-2 ${isCurrentUser ? 'justify-end flex-row-reverse' : ''}`}>
              <h1 className="font-light" style={{ fontSize: '10px' }}>{displayName}</h1>
              <h1 className={`flex font-light ${isCurrentUser ? 'flex-row-reverse' : ''}`} style={{ fontSize: '10px' }}>
                {formattedTime} <span className="mx-1"> </span> {formattedDate}
              </h1>
              {message.is_edit && (
                <h1 className="font-light" style={{ fontSize: '10px' }}><Edit2 size={10} /></h1>
              )}
            </div>
            <p className={`break-words font-medium rounded-bl-3xl w-fit ${isCurrentUser ? 'text-right' : ''}`}>
              {message.text}
            </p>
          </div>

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
        <MoreVertical className="opacity-50 hover:opacity-100 active:opacity-100 transition-opacity duration-200 outline:none" />
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
