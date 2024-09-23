"use client";
import { Imessage, useMessage } from "@/lib/store/messages";
import React, { useEffect, useRef, useState } from "react";
import Message from "./message";
import { DeleteAlert, EditAlert } from "./message-actions";
import { supabaseClient } from "@/lib/backend/client";
import { toast } from "sonner";
import { ArrowDown } from "lucide-react";
import LoadMoreMessages from "./load-more-messages";
import CompanyLogo from "./svgs/company-logo";
import OpusLogo from "./svgs/opus-logo";
import OpusBox from "./svgs/opus-logo-box";

const MessagesList = () => {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [userScrolled, setUserScrolled] = useState(false);
  const [notification, setNotification] = useState(0);
  const {
    messages,
    addMessage,
    optimisticIds,
    optimisticDeleteMessage,
    optimisticUpdateMessage,
  } = useMessage((state) => state);
  const supabase = supabaseClient();
  

  useEffect(() => {
    const channel = supabase
      .channel("chatroom")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          console.log("Payload received on INSERT:", payload.new);
          if (!optimisticIds.includes(payload.new.id)) {
            const { error, data } = await supabase
              .from("users")
              .select("*")
              .eq("id", payload.new.send_by)
              .single();
            if (error) {
              toast.error(error.message);
            } else {
              const newMessage = {
                ...payload.new,
                users: data,
              };
              addMessage(newMessage as unknown as Imessage);
            }
          }
          const scrollContainer = scrollRef.current;
          if (
            scrollContainer.scrollTop <
            scrollContainer.scrollHeight - scrollContainer.clientHeight - 10
          ) {
            setNotification((current) => current + 1);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          optimisticDeleteMessage(payload.old.id);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          optimisticUpdateMessage(payload.new as Imessage);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer && !userScrolled) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const isScroll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;
      setUserScrolled(isScroll);
      if (
        scrollContainer.scrollTop ===
        scrollContainer.scrollHeight - scrollContainer.clientHeight
      ) {
        setNotification(0);
      }
    }
  };
  const scrollDown = () => {
    setNotification(0);
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  const formatDate = (date: any) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
    const year = date.getFullYear();

    return `${weekday}, ${day} ${month} ${year}`;
  };

  return (
    <>
      <div className="flex flex-col h-[12vh] justify-center items-end bg-transparent relative">
        <div className="flex w-full mb-8 justify-between items-start px-5">
          <CompanyLogo
            className="h-[5em] w-[7em] fill-current"

          />

          <div className="relative">
            <OpusLogo
              className="h-[5em] w-[7em] fill-current"

            />
            <OpusBox
              className="absolute left-[-4px] top-1/2 transform -translate-y-1/2 h-[2em] w-[2em] fill-current"

            />
          </div>

        </div>

        {/* Today's Date */}
        <div className="absolute bottom-0 right-2 mb-2 text-xs tracking-wide" style={{ letterSpacing: '0.1em' }}>
          {formatDate(new Date())}
        </div>
      </div>



      <div
        className="flex-1 flex flex-col p-5 h-full overflow-y-auto hide-scrollbar"
        ref={scrollRef}
        onScroll={handleOnScroll}
      >
        <div className="flex-1 pb-5 ">
          <LoadMoreMessages />
        </div>
        <div className=" space-y-7">
          {messages.map((value, index) => {
            return <Message key={index} message={value} />;
          })}
        </div>

        <DeleteAlert />
        <EditAlert />
      </div>
      {userScrolled && (
        <div className="absolute bottom-32 w-full">
          {notification ? (
            <div
              className="mx-auto w-fit text-sm font-semibold bg-secondary p-2 rounded-full ring-2 ring-current cursor-pointer"
              onClick={scrollDown}
            >
              <h1>
                {notification} new {notification > 1 ? "messages!" : "message!"}
              </h1>
            </div>
          ) : (
            <div
              className="w-10 h-10 bg-background rounded-full justify-center items-center flex mx-auto ring-2 ring-current cursor-pointer hover:scale-110 transition-all"
              onClick={scrollDown}
            >
              <ArrowDown />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MessagesList;