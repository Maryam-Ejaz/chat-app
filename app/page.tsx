import ChatHeader from "@/components/chat-header";
import { supabaseServer } from "@/lib/backend/server";
import InitUser from "@/lib/store/initUser";
import ChatInput from "@/components/chat-input";
import ChatMessages from "@/components/chat-messages";
import ChatAbout from "@/components/chat-about";

const Home = async () => {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  console.log(data.user?.user_metadata);

  return (
    <>
      <div className="w-screen mx-auto glass h-full hide-scrollbar">
        <div className="h-screen flex flex-col relative hide-scrollbar">
          <ChatHeader user={data.user} />
          {data.user ? (
            <>
              <ChatMessages />
              <ChatInput />
            </>
          ) : (
            <ChatAbout />
          )}
        </div>
      </div>
      <InitUser user={data.user} />
    </>
  );
};

export default Home;
