import ChatHeader from "@/components/chat-header";
import { supabaseServer } from "@/lib/backend/server";
import InitUser from "@/lib/store/initUser";
import ChatInput from "@/components/chat-input";
import ChatMessages from "@/components/chat-messages";
import ChatAbout from "@/components/chat-about";

const Home = async () => {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getSession();
  console.log(data);

  return (
    <>
      <div className="w-screen mx-auto glass h-full hide-scrollbar">
        <div className="h-screen flex flex-col relative hide-scrollbar">
          <ChatHeader user={data.session?.user} />
          {data.session?.user ? (
            <>
              <ChatMessages />
              <ChatInput />
            </>
          ) : (
            <ChatAbout />
          )}
        </div>
      </div>
      <InitUser user={data.session?.user} />
    </>
  );
};

export default Home;
